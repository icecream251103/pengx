const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PenGx Token", function () {
    let pengx, oracleAggregator, circuitBreaker, timelock;
    let owner, user1, user2, feeRecipient;
    let deployer;

    const INITIAL_PRICE = ethers.utils.parseEther("3350"); // $3350 per oz
    const MINT_FEE = 50; // 0.5%
    const REDEEM_FEE = 50; // 0.5%

    beforeEach(async function () {
        [owner, user1, user2, feeRecipient] = await ethers.getSigners();

        // Deploy Circuit Breaker
        const CircuitBreaker = await ethers.getContractFactory("CircuitBreaker");
        circuitBreaker = await CircuitBreaker.deploy(
            500, // 5% deviation threshold
            300, // 5 minute time window
            3600 // 1 hour cooldown
        );

        // Deploy Oracle Aggregator
        const OracleAggregator = await ethers.getContractFactory("OracleAggregator");
        oracleAggregator = await OracleAggregator.deploy();

        // Deploy Timelock
        const PentaGoldTimelock = await ethers.getContractFactory("PentaGoldTimelock");
        timelock = await PentaGoldTimelock.deploy(
            [owner.address], // proposers
            [owner.address], // executors
            owner.address    // admin
        );

        // Deploy PenGx as upgradeable proxy
        const PenGx = await ethers.getContractFactory("PenGx");
        pengx = await upgrades.deployProxy(PenGx, [
            "PentaGold",
            "PenGx",
            oracleAggregator.address,
            circuitBreaker.address,
            feeRecipient.address
        ], { initializer: 'initialize' });

        // Grant roles
        await circuitBreaker.grantRole(
            await circuitBreaker.CIRCUIT_MANAGER_ROLE(),
            pengx.address
        );
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await pengx.name()).to.equal("PentaGold");
            expect(await pengx.symbol()).to.equal("PenGx");
        });

        it("Should set the correct initial parameters", async function () {
            expect(await pengx.mintFee()).to.equal(MINT_FEE);
            expect(await pengx.redeemFee()).to.equal(REDEEM_FEE);
            expect(await pengx.feeRecipient()).to.equal(feeRecipient.address);
        });

        it("Should grant correct roles to deployer", async function () {
            const DEFAULT_ADMIN_ROLE = await pengx.DEFAULT_ADMIN_ROLE();
            const MINTER_ROLE = await pengx.MINTER_ROLE();
            const PAUSER_ROLE = await pengx.PAUSER_ROLE();

            expect(await pengx.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
            expect(await pengx.hasRole(MINTER_ROLE, owner.address)).to.be.true;
            expect(await pengx.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
        });
    });

    describe("Minting", function () {
        beforeEach(async function () {
            // Mock oracle price
            await oracleAggregator.updateAggregatedPrice();
        });

        it("Should mint tokens correctly", async function () {
            const usdAmount = ethers.utils.parseEther("1000"); // $1000
            const expectedTokens = usdAmount.div(INITIAL_PRICE.div(ethers.utils.parseEther("1")));
            const fee = expectedTokens.mul(MINT_FEE).div(10000);
            const tokensAfterFee = expectedTokens.sub(fee);

            await expect(pengx.connect(user1).mint(usdAmount, tokensAfterFee))
                .to.emit(pengx, "Mint")
                .withArgs(user1.address, usdAmount, tokensAfterFee, fee);

            expect(await pengx.balanceOf(user1.address)).to.equal(tokensAfterFee);
            expect(await pengx.balanceOf(feeRecipient.address)).to.equal(fee);
        });

        it("Should reject minting below minimum amount", async function () {
            const tooSmallAmount = ethers.utils.parseEther("0.0001");
            
            await expect(pengx.connect(user1).mint(tooSmallAmount, 0))
                .to.be.revertedWithCustomError(pengx, "InvalidAmount");
        });

        it("Should reject minting above maximum amount", async function () {
            const tooLargeAmount = ethers.utils.parseEther("2000000"); // 2M USD
            
            await expect(pengx.connect(user1).mint(tooLargeAmount, 0))
                .to.be.revertedWithCustomError(pengx, "InvalidAmount");
        });

        it("Should respect slippage protection", async function () {
            const usdAmount = ethers.utils.parseEther("1000");
            const tooHighMinTokens = ethers.utils.parseEther("1000"); // Unrealistic expectation
            
            await expect(pengx.connect(user1).mint(usdAmount, tooHighMinTokens))
                .to.be.revertedWithCustomError(pengx, "InvalidAmount");
        });
    });

    describe("Redeeming", function () {
        beforeEach(async function () {
            // Setup: mint some tokens first
            await oracleAggregator.updateAggregatedPrice();
            const usdAmount = ethers.utils.parseEther("1000");
            const expectedTokens = usdAmount.div(INITIAL_PRICE.div(ethers.utils.parseEther("1")));
            const fee = expectedTokens.mul(MINT_FEE).div(10000);
            const tokensAfterFee = expectedTokens.sub(fee);
            
            await pengx.connect(user1).mint(usdAmount, tokensAfterFee);
        });

        it("Should redeem tokens correctly", async function () {
            const tokenAmount = ethers.utils.parseEther("0.1");
            const expectedUsd = tokenAmount.mul(INITIAL_PRICE).div(ethers.utils.parseEther("1"));
            const fee = expectedUsd.mul(REDEEM_FEE).div(10000);
            const usdAfterFee = expectedUsd.sub(fee);

            const initialBalance = await pengx.balanceOf(user1.address);

            await expect(pengx.connect(user1).redeem(tokenAmount, usdAfterFee))
                .to.emit(pengx, "Redeem")
                .withArgs(user1.address, tokenAmount, usdAfterFee, fee);

            expect(await pengx.balanceOf(user1.address)).to.equal(initialBalance.sub(tokenAmount));
        });

        it("Should reject redeeming more than balance", async function () {
            const balance = await pengx.balanceOf(user1.address);
            const tooMuchTokens = balance.add(ethers.utils.parseEther("1"));
            
            await expect(pengx.connect(user1).redeem(tooMuchTokens, 0))
                .to.be.revertedWithCustomError(pengx, "InsufficientBalance");
        });

        it("Should respect slippage protection on redeem", async function () {
            const tokenAmount = ethers.utils.parseEther("0.1");
            const tooHighMinUsd = ethers.utils.parseEther("1000"); // Unrealistic expectation
            
            await expect(pengx.connect(user1).redeem(tokenAmount, tooHighMinUsd))
                .to.be.revertedWithCustomError(pengx, "InvalidAmount");
        });
    });

    describe("Emergency Functions", function () {
        it("Should allow emergency pause", async function () {
            await expect(pengx.emergencyPause("Test emergency"))
                .to.emit(pengx, "EmergencyModeActivated")
                .withArgs(owner.address, "Test emergency");

            expect(await pengx.emergencyMode()).to.be.true;
            expect(await pengx.paused()).to.be.true;
        });

        it("Should prevent operations during emergency", async function () {
            await pengx.emergencyPause("Test emergency");
            
            await expect(pengx.connect(user1).mint(ethers.utils.parseEther("100"), 0))
                .to.be.revertedWithCustomError(pengx, "EmergencyModeActive");
        });

        it("Should allow deactivating emergency mode", async function () {
            await pengx.emergencyPause("Test emergency");
            
            await expect(pengx.deactivateEmergency())
                .to.emit(pengx, "EmergencyModeDeactivated")
                .withArgs(owner.address);

            expect(await pengx.emergencyMode()).to.be.false;
            expect(await pengx.paused()).to.be.false;
        });
    });

    describe("Access Control", function () {
        it("Should prevent unauthorized fee updates", async function () {
            await expect(pengx.connect(user1).updateFees(100, 100))
                .to.be.revertedWith("AccessControl:");
        });

        it("Should allow authorized fee updates", async function () {
            await expect(pengx.updateFees(100, 100))
                .to.emit(pengx, "FeesUpdated")
                .withArgs(100, 100);

            expect(await pengx.mintFee()).to.equal(100);
            expect(await pengx.redeemFee()).to.equal(100);
        });

        it("Should prevent setting fees too high", async function () {
            await expect(pengx.updateFees(1001, 100))
                .to.be.revertedWith("Fee too high");
        });
    });

    describe("Circuit Breaker Integration", function () {
        it("Should respect circuit breaker triggers", async function () {
            // Trigger circuit breaker by simulating extreme price movement
            await circuitBreaker.checkPrice(INITIAL_PRICE.mul(2)); // 100% increase
            
            await expect(pengx.connect(user1).mint(ethers.utils.parseEther("100"), 0))
                .to.be.revertedWithCustomError(pengx, "CircuitBreakerActive");
        });
    });

    describe("Upgradeability", function () {
        it("Should be upgradeable by authorized role", async function () {
            const PenGxV2 = await ethers.getContractFactory("PenGx");
            const upgraded = await upgrades.upgradeProxy(pengx.address, PenGxV2);
            
            expect(await upgraded.version()).to.equal("1.0.0");
        });

        it("Should prevent unauthorized upgrades", async function () {
            const UPGRADER_ROLE = await pengx.UPGRADER_ROLE();
            await pengx.revokeRole(UPGRADER_ROLE, owner.address);
            
            const PenGxV2 = await ethers.getContractFactory("PenGx");
            await expect(upgrades.upgradeProxy(pengx.address, PenGxV2))
                .to.be.revertedWith("AccessControl:");
        });
    });

    describe("Oracle Integration", function () {
        it("Should get current price from oracle", async function () {
            const [price, timestamp] = await pengx.getCurrentPrice();
            expect(price).to.be.gt(0);
            expect(timestamp).to.be.gt(0);
        });

        it("Should update oracle aggregator", async function () {
            const newAggregator = await ethers.getContractFactory("OracleAggregator");
            const newAggregatorInstance = await newAggregator.deploy();

            await expect(pengx.updateOracleAggregator(newAggregatorInstance.address))
                .to.emit(pengx, "OracleAggregatorUpdated")
                .withArgs(newAggregatorInstance.address);

            expect(await pengx.oracleAggregator()).to.equal(newAggregatorInstance.address);
        });
    });
});