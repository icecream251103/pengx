const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 Bắt đầu deploy DCA System...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts với account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Contract addresses (thay đổi theo môi trường)
  const PENGX_TOKEN = process.env.PENGX_TOKEN_ADDRESS || "";
  const ORACLE_AGGREGATOR = process.env.ORACLE_AGGREGATOR_ADDRESS || "";
  const FEE_RECIPIENT = process.env.FEE_RECIPIENT || deployer.address;
  
  // DCA Parameters
  const EXECUTION_FEE = 100; // 1% (basis points)
  const PLATFORM_FEE = 50;   // 0.5% (basis points)
  const EXECUTOR_REWARD = ethers.utils.parseUnits("1", 6); // $1 USDC
  const MAX_GAS_LIMIT = 500000;
  const BATCH_SIZE = 20;

  // Deploy DCAManager
  console.log("\n📦 Deploying DCAManager...");
  const DCAManager = await ethers.getContractFactory("DCAManager");
  
  const dcaManager = await upgrades.deployProxy(DCAManager, [
    PENGX_TOKEN,
    ORACLE_AGGREGATOR,
    FEE_RECIPIENT,
    EXECUTION_FEE,
    PLATFORM_FEE
  ], {
    initializer: 'initialize',
    kind: 'uups'
  });

  await dcaManager.deployed();
  console.log("✅ DCAManager deployed to:", dcaManager.address);

  // Deploy DCAAutomationBot
  console.log("\n📦 Deploying DCAAutomationBot...");
  const DCAAutomationBot = await ethers.getContractFactory("DCAAutomationBot");
  
  const automationBot = await DCAAutomationBot.deploy(
    dcaManager.address,
    EXECUTOR_REWARD,
    MAX_GAS_LIMIT,
    BATCH_SIZE
  );

  await automationBot.deployed();
  console.log("✅ DCAAutomationBot deployed to:", automationBot.address);

  // Setup roles and permissions
  console.log("\n🔐 Setting up roles and permissions...");
  
  const EXECUTOR_ROLE = await dcaManager.EXECUTOR_ROLE();
  await dcaManager.grantRole(EXECUTOR_ROLE, automationBot.address);
  console.log("✅ Granted EXECUTOR_ROLE to AutomationBot");

  // Setup supported tokens (for testnet)
  if (process.env.NETWORK === "testnet") {
    console.log("\n🪙 Setting up supported tokens for testnet...");
    
    // Deploy mock USDC for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockUSDC.deployed();
    console.log("✅ Mock USDC deployed to:", mockUSDC.address);

    // Set as supported token
    await dcaManager.setSupportedToken(mockUSDC.address, true);
    console.log("✅ Mock USDC set as supported token");

    // Mint some USDC for testing
    const testAmount = ethers.utils.parseUnits("10000", 6); // 10,000 USDC
    await mockUSDC.mint(deployer.address, testAmount);
    console.log("✅ Minted 10,000 USDC for testing");
  }

  // For mainnet, setup real token addresses
  if (process.env.NETWORK === "mainnet") {
    console.log("\n🪙 Setting up supported tokens for mainnet...");
    
    const USDC_ADDRESS = "0xA0b86a33E6441b8435b662303d3fd9b6bF4b9b7c"; // USDC on Ethereum
    const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT on Ethereum
    
    await dcaManager.setSupportedToken(USDC_ADDRESS, true);
    await dcaManager.setSupportedToken(USDT_ADDRESS, true);
    console.log("✅ Set USDC and USDT as supported tokens");
  }

  // Verify contracts (if on public network)
  if (process.env.VERIFY_CONTRACTS === "true") {
    console.log("\n🔍 Verifying contracts...");
    
    try {
      await hre.run("verify:verify", {
        address: dcaManager.address,
        constructorArguments: [],
      });
      console.log("✅ DCAManager verified");
    } catch (error) {
      console.log("❌ DCAManager verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: automationBot.address,
        constructorArguments: [
          dcaManager.address,
          EXECUTOR_REWARD,
          MAX_GAS_LIMIT,
          BATCH_SIZE
        ],
      });
      console.log("✅ DCAAutomationBot verified");
    } catch (error) {
      console.log("❌ DCAAutomationBot verification failed:", error.message);
    }
  }

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      DCAManager: {
        address: dcaManager.address,
        implementation: await upgrades.erc1967.getImplementationAddress(dcaManager.address)
      },
      DCAAutomationBot: {
        address: automationBot.address
      }
    },
    parameters: {
      executionFee: EXECUTION_FEE,
      platformFee: PLATFORM_FEE,
      executorReward: EXECUTOR_REWARD.toString(),
      maxGasLimit: MAX_GAS_LIMIT,
      batchSize: BATCH_SIZE
    }
  };

  console.log("\n📊 Deployment Summary:");
  console.log("==========================================");
  console.log("Network:", hre.network.name);
  console.log("DCAManager:", dcaManager.address);
  console.log("DCAAutomationBot:", automationBot.address);
  console.log("Fee Recipient:", FEE_RECIPIENT);
  console.log("Execution Fee:", EXECUTION_FEE, "bps");
  console.log("Platform Fee:", PLATFORM_FEE, "bps");
  console.log("==========================================");

  // Save to file
  const fs = require('fs');
  const deploymentPath = `./deployments/${hre.network.name}-dca-deployment.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentPath);

  console.log("\n🎉 DCA System deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
