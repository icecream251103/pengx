const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("🚀 Starting PentaGold Smart Contract Deployment...\n");

    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

    // Deploy Circuit Breaker
    console.log("🔧 Deploying Circuit Breaker...");
    const CircuitBreaker = await ethers.getContractFactory("CircuitBreaker");
    const circuitBreaker = await CircuitBreaker.deploy(
        500,  // 5% deviation threshold
        300,  // 5 minute time window
        3600  // 1 hour cooldown
    );
    await circuitBreaker.deployed();
    console.log("✅ Circuit Breaker deployed to:", circuitBreaker.address);

    // Deploy Oracle Aggregator
    console.log("🔧 Deploying Oracle Aggregator...");
    const OracleAggregator = await ethers.getContractFactory("OracleAggregator");
    const oracleAggregator = await OracleAggregator.deploy();
    await oracleAggregator.deployed();
    console.log("✅ Oracle Aggregator deployed to:", oracleAggregator.address);

    // Deploy Timelock Controller
    console.log("🔧 Deploying Timelock Controller...");
    const PentaGoldTimelock = await ethers.getContractFactory("PentaGoldTimelock");
    const timelock = await PentaGoldTimelock.deploy(
        [deployer.address], // proposers
        [deployer.address], // executors
        deployer.address    // admin
    );
    await timelock.deployed();
    console.log("✅ Timelock Controller deployed to:", timelock.address);

    // Deploy PenGx Token (Upgradeable)
    console.log("🔧 Deploying PenGx Token (Upgradeable Proxy)...");
    const PenGx = await ethers.getContractFactory("PenGx");
    const pengx = await upgrades.deployProxy(PenGx, [
        "PentaGold",
        "PenGx",
        oracleAggregator.address,
        circuitBreaker.address,
        deployer.address // fee recipient
    ], { 
        initializer: 'initialize',
        kind: 'uups'
    });
    await pengx.deployed();
    console.log("✅ PenGx Token deployed to:", pengx.address);

    // Setup roles and permissions
    console.log("\n🔐 Setting up roles and permissions...");
    
    // Grant circuit breaker manager role to PenGx contract
    const CIRCUIT_MANAGER_ROLE = await circuitBreaker.CIRCUIT_MANAGER_ROLE();
    await circuitBreaker.grantRole(CIRCUIT_MANAGER_ROLE, pengx.address);
    console.log("✅ Granted CIRCUIT_MANAGER_ROLE to PenGx contract");

    // Grant price updater role to deployer (for oracle)
    const PRICE_UPDATER_ROLE = await oracleAggregator.PRICE_UPDATER_ROLE();
    await oracleAggregator.grantRole(PRICE_UPDATER_ROLE, deployer.address);
    console.log("✅ Granted PRICE_UPDATER_ROLE to deployer");

    // Setup initial oracle (mock for testing)
    console.log("\n🔧 Setting up initial oracle configuration...");
    
    // For mainnet, these would be real oracle addresses
    // For testing, we'll add the deployer as a mock oracle
    try {
        await oracleAggregator.addOracle(
            deployer.address, // Mock oracle address
            10000,           // 100% weight
            3600             // 1 hour max staleness
        );
        console.log("✅ Added initial oracle configuration");
    } catch (error) {
        console.log("⚠️  Oracle setup skipped (will be configured later)");
    }

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    
    const tokenName = await pengx.name();
    const tokenSymbol = await pengx.symbol();
    const version = await pengx.version();
    
    console.log("📊 Token Name:", tokenName);
    console.log("📊 Token Symbol:", tokenSymbol);
    console.log("📊 Contract Version:", version);
    console.log("📊 Oracle Aggregator:", await pengx.oracleAggregator());
    console.log("📊 Circuit Breaker:", await pengx.circuitBreaker());

    // Save deployment addresses
    const deploymentInfo = {
        network: await ethers.provider.getNetwork(),
        deployer: deployer.address,
        contracts: {
            PenGx: pengx.address,
            OracleAggregator: oracleAggregator.address,
            CircuitBreaker: circuitBreaker.address,
            TimelockController: timelock.address
        },
        timestamp: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber()
    };

    console.log("\n📋 Deployment Summary:");
    console.log("=====================================");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    console.log("=====================================");

    // Security recommendations
    console.log("\n🛡️  Security Recommendations:");
    console.log("1. Transfer admin roles to multisig wallet");
    console.log("2. Setup real oracle feeds (Chainlink, Band Protocol)");
    console.log("3. Configure proper timelock delays for governance");
    console.log("4. Conduct thorough security audit before mainnet");
    console.log("5. Setup monitoring and alerting systems");
    console.log("6. Test all emergency functions");

    console.log("\n🎉 Deployment completed successfully!");
    
    return deploymentInfo;
}

// Handle deployment errors
main()
    .then((deploymentInfo) => {
        console.log("\n✅ All contracts deployed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });