const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DCAManager", function () {
  let dcaManager;
  let penGxToken;
  let usdcToken;
  let oracleAggregator;
  let owner, user1, user2, executor, feeRecipient;

  const USDC_DECIMALS = 6;
  const PENGX_DECIMALS = 18;
  const INITIAL_USDC_BALANCE = ethers.utils.parseUnits("10000", USDC_DECIMALS); // $10,000 USDC
  const DCA_AMOUNT = ethers.utils.parseUnits("100", USDC_DECIMALS); // $100 per execution
  const FREQUENCY = 24 * 60 * 60; // 1 day
  const EXECUTION_FEE = 100; // 1%
  const PLATFORM_FEE = 50; // 0.5%

  beforeEach(async function () {
    [owner, user1, user2, executor, feeRecipient] = await ethers.getSigners();

    // Deploy mock USDC token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdcToken = await MockERC20.deploy("USD Coin", "USDC", USDC_DECIMALS);
    
    // Deploy mock PenGx token
    penGxToken = await MockERC20.deploy("PentaGold", "PENGX", PENGX_DECIMALS);

    // Deploy mock Oracle Aggregator
    const MockOracleAggregator = await ethers.getContractFactory("MockOracleAggregator");
    oracleAggregator = await MockOracleAggregator.deploy();

    // Deploy DCAManager
    const DCAManager = await ethers.getContractFactory("DCAManager");
    dcaManager = await upgrades.deployProxy(DCAManager, [
      penGxToken.address,
      oracleAggregator.address,
      feeRecipient.address,
      EXECUTION_FEE,
      PLATFORM_FEE
    ]);

    // Setup initial balances
    await usdcToken.mint(user1.address, INITIAL_USDC_BALANCE);
    await usdcToken.mint(user2.address, INITIAL_USDC_BALANCE);

    // Setup supported tokens
    await dcaManager.setSupportedToken(usdcToken.address, true);

    // Grant executor role
    const EXECUTOR_ROLE = await dcaManager.EXECUTOR_ROLE();
    await dcaManager.grantRole(EXECUTOR_ROLE, executor.address);

    // Set initial gold price: $2000/oz
    const goldPrice = ethers.utils.parseUnits("2000", 18);
    await oracleAggregator.setPrice(goldPrice, Math.floor(Date.now() / 1000));
  });

  describe("Strategy Creation", function () {
    it("Nên tạo được chiến lược DCA thành công", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const endTime = startTime + (30 * 24 * 60 * 60); // 30 days later

      // Approve USDC for DCA Manager
      await usdcToken.connect(user1).approve(dcaManager.address, DCA_AMOUNT);

      const tx = await dcaManager.connect(user1).createDCAStrategy(
        usdcToken.address,
        penGxToken.address,
        DCA_AMOUNT,
        FREQUENCY,
        startTime,
        endTime
      );

      expect(tx).to.emit(dcaManager, "DCAStrategyCreated")
        .withArgs(1, user1.address, usdcToken.address, penGxToken.address, DCA_AMOUNT, FREQUENCY, startTime, endTime);

      const strategy = await dcaManager.getDCAStrategy(1);
      expect(strategy.user).to.equal(user1.address);
      expect(strategy.amount).to.equal(DCA_AMOUNT);
      expect(strategy.frequency).to.equal(FREQUENCY);
      expect(strategy.isActive).to.be.true;
    });

    it("Nên từ chối tạo chiến lược với số tiền không hợp lệ", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const invalidAmount = ethers.utils.parseUnits("0.5", USDC_DECIMALS); // < $1

      await expect(
        dcaManager.connect(user1).createDCAStrategy(
          usdcToken.address,
          penGxToken.address,
          invalidAmount,
          FREQUENCY,
          startTime,
          0
        )
      ).to.be.revertedWith("InvalidAmount");
    });

    it("Nên từ chối tạo chiến lược với token không được hỗ trợ", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const unsupportedToken = await MockERC20.deploy("Unsupported", "UNS", 18);
      
      const startTime = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        dcaManager.connect(user1).createDCAStrategy(
          unsupportedToken.address,
          penGxToken.address,
          DCA_AMOUNT,
          FREQUENCY,
          startTime,
          0
        )
      ).to.be.revertedWith("UnsupportedToken");
    });
  });

  describe("Strategy Execution", function () {
    let strategyId;

    beforeEach(async function () {
      const startTime = Math.floor(Date.now() / 1000); // Start immediately
      
      // Approve USDC
      await usdcToken.connect(user1).approve(dcaManager.address, ethers.constants.MaxUint256);
      
      // Create strategy
      const tx = await dcaManager.connect(user1).createDCAStrategy(
        usdcToken.address,
        penGxToken.address,
        DCA_AMOUNT,
        FREQUENCY,
        startTime,
        0 // No end time
      );
      
      const receipt = await tx.wait();
      strategyId = receipt.events.find(e => e.event === "DCAStrategyCreated").args.strategyId;
    });

    it("Nên thực hiện DCA thành công", async function () {
      // Setup PenGx balance for DCA manager (mock swap)
      const expectedTokens = ethers.utils.parseUnits("0.05", PENGX_DECIMALS); // $100 / $2000 = 0.05 PenGx
      await penGxToken.mint(dcaManager.address, expectedTokens);

      const initialUsdcBalance = await usdcToken.balanceOf(user1.address);
      const initialPenGxBalance = await penGxToken.balanceOf(user1.address);

      const tx = await dcaManager.connect(executor).executeDCA(strategyId);
      
      expect(tx).to.emit(dcaManager, "DCAStrategyExecuted");

      // Check balances
      const finalUsdcBalance = await usdcToken.balanceOf(user1.address);
      const finalPenGxBalance = await penGxToken.balanceOf(user1.address);

      expect(finalUsdcBalance).to.be.lt(initialUsdcBalance);
      expect(finalPenGxBalance).to.be.gt(initialPenGxBalance);

      // Check strategy stats
      const strategy = await dcaManager.getDCAStrategy(strategyId);
      expect(strategy.executionCount).to.equal(1);
      expect(strategy.totalInvested).to.be.gt(0);
      expect(strategy.totalReceived).to.be.gt(0);
    });

    it("Nên từ chối thực hiện khi chưa đến thời gian", async function () {
      // Execute once
      await penGxToken.mint(dcaManager.address, ethers.utils.parseUnits("1", PENGX_DECIMALS));
      await dcaManager.connect(executor).executeDCA(strategyId);

      // Try to execute again immediately
      await expect(
        dcaManager.connect(executor).executeDCA(strategyId)
      ).to.be.revertedWith("StrategyNotExecutable");
    });

    it("Nên từ chối thực hiện bởi người không có quyền", async function () {
      await expect(
        dcaManager.connect(user2).executeDCA(strategyId)
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Strategy Management", function () {
    let strategyId;

    beforeEach(async function () {
      const startTime = Math.floor(Date.now() / 1000);
      
      await usdcToken.connect(user1).approve(dcaManager.address, ethers.constants.MaxUint256);
      
      const tx = await dcaManager.connect(user1).createDCAStrategy(
        usdcToken.address,
        penGxToken.address,
        DCA_AMOUNT,
        FREQUENCY,
        startTime,
        0
      );
      
      const receipt = await tx.wait();
      strategyId = receipt.events.find(e => e.event === "DCAStrategyCreated").args.strategyId;
    });

    it("Nên pause được chiến lược", async function () {
      await dcaManager.connect(user1).pauseDCAStrategy(strategyId);
      
      const strategy = await dcaManager.getDCAStrategy(strategyId);
      expect(strategy.isPaused).to.be.true;
      
      expect(await dcaManager.isExecutable(strategyId)).to.be.false;
    });

    it("Nên resume được chiến lược", async function () {
      await dcaManager.connect(user1).pauseDCAStrategy(strategyId);
      await dcaManager.connect(user1).resumeDCAStrategy(strategyId);
      
      const strategy = await dcaManager.getDCAStrategy(strategyId);
      expect(strategy.isPaused).to.be.false;
    });

    it("Nên cancel được chiến lược", async function () {
      await dcaManager.connect(user1).cancelDCAStrategy(strategyId);
      
      const strategy = await dcaManager.getDCAStrategy(strategyId);
      expect(strategy.isActive).to.be.false;
    });

    it("Nên update được chiến lược", async function () {
      const newAmount = ethers.utils.parseUnits("200", USDC_DECIMALS);
      const newFrequency = 2 * 24 * 60 * 60; // 2 days
      
      await dcaManager.connect(user1).updateDCAStrategy(
        strategyId,
        newAmount,
        newFrequency,
        0
      );
      
      const strategy = await dcaManager.getDCAStrategy(strategyId);
      expect(strategy.amount).to.equal(newAmount);
      expect(strategy.frequency).to.equal(newFrequency);
    });

    it("Nên từ chối thao tác bởi người không phải chủ sở hữu", async function () {
      await expect(
        dcaManager.connect(user2).pauseDCAStrategy(strategyId)
      ).to.be.revertedWith("UnauthorizedUser");
    });
  });

  describe("Batch Execution", function () {
    let strategyIds = [];

    beforeEach(async function () {
      const startTime = Math.floor(Date.now() / 1000);
      
      // Create multiple strategies
      for (let i = 0; i < 3; i++) {
        await usdcToken.connect(user1).approve(dcaManager.address, DCA_AMOUNT);
        
        const tx = await dcaManager.connect(user1).createDCAStrategy(
          usdcToken.address,
          penGxToken.address,
          DCA_AMOUNT,
          FREQUENCY,
          startTime,
          0
        );
        
        const receipt = await tx.wait();
        const strategyId = receipt.events.find(e => e.event === "DCAStrategyCreated").args.strategyId;
        strategyIds.push(strategyId);
      }
    });

    it("Nên thực hiện batch DCA thành công", async function () {
      // Setup PenGx for swaps
      await penGxToken.mint(dcaManager.address, ethers.utils.parseUnits("1", PENGX_DECIMALS));

      await dcaManager.connect(executor).batchExecuteDCA(strategyIds);

      // Check that all strategies were executed
      for (const strategyId of strategyIds) {
        const strategy = await dcaManager.getDCAStrategy(strategyId);
        expect(strategy.executionCount).to.equal(1);
      }
    });
  });

  describe("View Functions", function () {
    it("Nên lấy được danh sách strategies của user", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      
      // Create 2 strategies for user1
      for (let i = 0; i < 2; i++) {
        await usdcToken.connect(user1).approve(dcaManager.address, DCA_AMOUNT);
        await dcaManager.connect(user1).createDCAStrategy(
          usdcToken.address,
          penGxToken.address,
          DCA_AMOUNT,
          FREQUENCY,
          startTime,
          0
        );
      }

      const userStrategies = await dcaManager.getUserStrategies(user1.address);
      expect(userStrategies.length).to.equal(2);
    });

    it("Nên lấy được danh sách executable strategies", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      
      await usdcToken.connect(user1).approve(dcaManager.address, DCA_AMOUNT);
      await dcaManager.connect(user1).createDCAStrategy(
        usdcToken.address,
        penGxToken.address,
        DCA_AMOUNT,
        FREQUENCY,
        startTime,
        0
      );

      const executableStrategies = await dcaManager.getExecutableStrategies();
      expect(executableStrategies.length).to.equal(1);
    });
  });

  describe("Admin Functions", function () {
    it("Nên set được supported token", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const newToken = await MockERC20.deploy("New Token", "NEW", 18);
      
      await dcaManager.setSupportedToken(newToken.address, true);
      expect(await dcaManager.supportedTokens(newToken.address)).to.be.true;
    });

    it("Nên set được fees", async function () {
      const newExecutionFee = 200; // 2%
      const newPlatformFee = 100; // 1%
      
      await dcaManager.setFees(newExecutionFee, newPlatformFee);
      
      expect(await dcaManager.executionFee()).to.equal(newExecutionFee);
      expect(await dcaManager.platformFee()).to.equal(newPlatformFee);
    });

    it("Nên activate/deactivate được emergency mode", async function () {
      const EMERGENCY_ROLE = await dcaManager.EMERGENCY_ROLE();
      await dcaManager.grantRole(EMERGENCY_ROLE, owner.address);
      
      await dcaManager.activateEmergencyMode();
      expect(await dcaManager.emergencyMode()).to.be.true;
      expect(await dcaManager.paused()).to.be.true;
      
      await dcaManager.deactivateEmergencyMode();
      expect(await dcaManager.emergencyMode()).to.be.false;
      expect(await dcaManager.paused()).to.be.false;
    });
  });
});
