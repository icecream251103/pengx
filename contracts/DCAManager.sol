// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IDCAManager.sol";
import "./interfaces/IOracleAggregator.sol";

/**
 * @title DCAManager
 * @dev Quản lý chiến lược DCA (Dollar Cost Averaging) cho token PenGx
 * @author PentaGold Team
 */
contract DCAManager is 
    IDCAManager,
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    // Constants
    uint256 public constant MIN_FREQUENCY = 1 hours; // Tối thiểu 1 giờ
    uint256 public constant MAX_FREQUENCY = 365 days; // Tối đa 1 năm
    uint256 public constant MIN_AMOUNT = 1e6; // $1 USDC
    uint256 public constant MAX_AMOUNT = 1000000e6; // $1M USDC
    uint256 public constant EXECUTION_WINDOW = 1 hours; // Cửa sổ thực hiện
    uint256 public constant MAX_SLIPPAGE = 500; // 5% slippage tối đa
    uint256 public constant PRECISION = 1e18;

    // State variables
    mapping(uint256 => DCAStrategy) public strategies;
    mapping(address => uint256[]) public userStrategies;
    mapping(address => bool) public supportedTokens;
    
    uint256 public strategyCounter;
    uint256 public executionFee; // Phí thực hiện (basis points)
    uint256 public platformFee; // Phí nền tảng (basis points)
    uint256 public totalValueLocked;
    
    address public feeRecipient;
    address public penGxToken;
    IOracleAggregator public oracleAggregator;
    
    // Gas optimization
    uint256 public maxGasPrice;
    uint256 public executorReward;

    // Emergency
    bool public emergencyMode;
    uint256 public emergencyTimestamp;

    // Events
    event EmergencyModeActivated(uint256 timestamp);
    event EmergencyModeDeactivated(uint256 timestamp);
    event FeesUpdated(uint256 executionFee, uint256 platformFee);
    event TokenSupportUpdated(address token, bool supported);
    event ExecutorRewardUpdated(uint256 newReward);

    // Errors
    error InvalidAmount();
    error InvalidFrequency();
    error InvalidTimestamp();
    error StrategyNotFound();
    error UnauthorizedUser();
    error StrategyNotActive();
    error StrategyNotExecutable();
    error UnsupportedToken();
    error InsufficientBalance();
    error ExecutionFailed();
    error SlippageTooHigh();
    error GasPriceTooHigh();
    error EmergencyModeActive();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Khởi tạo contract
     */
    function initialize(
        address _penGxToken,
        address _oracleAggregator,
        address _feeRecipient,
        uint256 _executionFee,
        uint256 _platformFee
    ) external initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);

        penGxToken = _penGxToken;
        oracleAggregator = IOracleAggregator(_oracleAggregator);
        feeRecipient = _feeRecipient;
        executionFee = _executionFee;
        platformFee = _platformFee;
        
        maxGasPrice = 100 gwei;
        executorReward = 1e6; // $1 USDC
    }

    /**
     * @dev Tạo chiến lược DCA mới
     */
    function createDCAStrategy(
        address paymentToken,
        address targetToken,
        uint256 amount,
        uint256 frequency,
        uint256 startTime,
        uint256 endTime
    ) external override nonReentrant whenNotPaused returns (uint256 strategyId) {
        if (emergencyMode) revert EmergencyModeActive();
        if (!supportedTokens[paymentToken]) revert UnsupportedToken();
        if (targetToken != penGxToken) revert UnsupportedToken();
        if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) revert InvalidAmount();
        if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) revert InvalidFrequency();
        if (startTime < block.timestamp) revert InvalidTimestamp();
        if (endTime != 0 && endTime <= startTime) revert InvalidTimestamp();

        // Kiểm tra balance
        uint256 userBalance = IERC20(paymentToken).balanceOf(msg.sender);
        if (userBalance < amount) revert InsufficientBalance();

        strategyId = ++strategyCounter;

        strategies[strategyId] = DCAStrategy({
            user: msg.sender,
            paymentToken: paymentToken,
            targetToken: targetToken,
            amount: amount,
            frequency: frequency,
            startTime: startTime,
            endTime: endTime,
            lastExecution: 0,
            totalInvested: 0,
            totalReceived: 0,
            executionCount: 0,
            isActive: true,
            isPaused: false
        });

        userStrategies[msg.sender].push(strategyId);

        emit DCAStrategyCreated(
            strategyId,
            msg.sender,
            paymentToken,
            targetToken,
            amount,
            frequency,
            startTime,
            endTime
        );

        return strategyId;
    }

    /**
     * @dev Thực hiện DCA cho một chiến lược
     */
    function executeDCA(uint256 strategyId) 
        external 
        override 
        onlyRole(EXECUTOR_ROLE) 
        nonReentrant 
        whenNotPaused 
        returns (ExecutionResult memory result) 
    {
        if (emergencyMode) revert EmergencyModeActive();
        if (tx.gasprice > maxGasPrice) revert GasPriceTooHigh();
        
        DCAStrategy storage strategy = strategies[strategyId];
        if (strategy.user == address(0)) revert StrategyNotFound();
        if (!strategy.isActive || strategy.isPaused) revert StrategyNotActive();
        if (!isExecutable(strategyId)) revert StrategyNotExecutable();

        uint256 gasStart = gasleft();

        // Lấy giá hiện tại từ oracle
        (uint256 currentPrice, uint256 timestamp) = oracleAggregator.getLatestPrice();
        
        // Kiểm tra balance của user
        uint256 userBalance = IERC20(strategy.paymentToken).balanceOf(strategy.user);
        if (userBalance < strategy.amount) revert InsufficientBalance();

        // Tính toán số token sẽ nhận được
        uint256 expectedTokens = _calculateTokenAmount(strategy.amount, currentPrice);
        
        // Transfer payment token từ user
        IERC20(strategy.paymentToken).safeTransferFrom(
            strategy.user,
            address(this),
            strategy.amount
        );

        // Tính phí
        uint256 executionFeeAmount = (strategy.amount * executionFee) / 10000;
        uint256 platformFeeAmount = (strategy.amount * platformFee) / 10000;
        uint256 investmentAmount = strategy.amount - executionFeeAmount - platformFeeAmount;

        // Thực hiện swap (mock implementation - thực tế cần integrate với DEX)
        uint256 tokensReceived = _executeSwap(
            strategy.paymentToken,
            strategy.targetToken,
            investmentAmount,
            expectedTokens
        );

        // Cập nhật strategy
        strategy.lastExecution = block.timestamp;
        strategy.totalInvested += investmentAmount;
        strategy.totalReceived += tokensReceived;
        strategy.executionCount++;

        // Transfer fees
        if (executionFeeAmount > 0) {
            IERC20(strategy.paymentToken).safeTransfer(msg.sender, executorReward);
            IERC20(strategy.paymentToken).safeTransfer(
                feeRecipient, 
                executionFeeAmount - executorReward
            );
        }
        if (platformFeeAmount > 0) {
            IERC20(strategy.paymentToken).safeTransfer(feeRecipient, platformFeeAmount);
        }

        // Transfer tokens to user
        IERC20(strategy.targetToken).safeTransfer(strategy.user, tokensReceived);

        // Kiểm tra xem strategy có kết thúc không
        if (strategy.endTime != 0 && block.timestamp >= strategy.endTime) {
            strategy.isActive = false;
        }

        uint256 gasUsed = gasStart - gasleft();

        result = ExecutionResult({
            amountIn: investmentAmount,
            amountOut: tokensReceived,
            price: currentPrice,
            timestamp: block.timestamp,
            gasUsed: gasUsed
        });

        emit DCAStrategyExecuted(
            strategyId,
            strategy.user,
            investmentAmount,
            tokensReceived,
            currentPrice,
            block.timestamp
        );

        return result;
    }

    /**
     * @dev Thực hiện batch DCA cho nhiều chiến lược
     */
    function batchExecuteDCA(uint256[] calldata strategyIds) 
        external 
        override 
        onlyRole(EXECUTOR_ROLE) 
        nonReentrant 
        whenNotPaused 
    {
        for (uint256 i = 0; i < strategyIds.length; i++) {
            try this.executeDCA(strategyIds[i]) {
                // Success - continue to next strategy
            } catch {
                // Failed - skip and continue
                continue;
            }
        }
    }

    /**
     * @dev Tạm dừng chiến lược DCA
     */
    function pauseDCAStrategy(uint256 strategyId) external override {
        DCAStrategy storage strategy = strategies[strategyId];
        if (strategy.user != msg.sender) revert UnauthorizedUser();
        if (!strategy.isActive) revert StrategyNotActive();
        
        strategy.isPaused = true;
        emit DCAStrategyPaused(strategyId, msg.sender);
    }

    /**
     * @dev Tiếp tục chiến lược DCA
     */
    function resumeDCAStrategy(uint256 strategyId) external override {
        DCAStrategy storage strategy = strategies[strategyId];
        if (strategy.user != msg.sender) revert UnauthorizedUser();
        if (!strategy.isActive) revert StrategyNotActive();
        
        strategy.isPaused = false;
        emit DCAStrategyResumed(strategyId, msg.sender);
    }

    /**
     * @dev Hủy chiến lược DCA
     */
    function cancelDCAStrategy(uint256 strategyId) external override {
        DCAStrategy storage strategy = strategies[strategyId];
        if (strategy.user != msg.sender) revert UnauthorizedUser();
        
        strategy.isActive = false;
        strategy.isPaused = false;
        emit DCAStrategyCancelled(strategyId, msg.sender);
    }

    /**
     * @dev Cập nhật chiến lược DCA
     */
    function updateDCAStrategy(
        uint256 strategyId,
        uint256 newAmount,
        uint256 newFrequency,
        uint256 newEndTime
    ) external override {
        DCAStrategy storage strategy = strategies[strategyId];
        if (strategy.user != msg.sender) revert UnauthorizedUser();
        if (!strategy.isActive) revert StrategyNotActive();
        
        if (newAmount != 0) {
            if (newAmount < MIN_AMOUNT || newAmount > MAX_AMOUNT) revert InvalidAmount();
            strategy.amount = newAmount;
        }
        
        if (newFrequency != 0) {
            if (newFrequency < MIN_FREQUENCY || newFrequency > MAX_FREQUENCY) revert InvalidFrequency();
            strategy.frequency = newFrequency;
        }
        
        if (newEndTime != strategy.endTime) {
            if (newEndTime != 0 && newEndTime <= block.timestamp) revert InvalidTimestamp();
            strategy.endTime = newEndTime;
        }

        emit DCAStrategyUpdated(strategyId, msg.sender);
    }

    /**
     * @dev Kiểm tra xem chiến lược có thể thực hiện không
     */
    function isExecutable(uint256 strategyId) public view override returns (bool) {
        DCAStrategy memory strategy = strategies[strategyId];
        
        if (!strategy.isActive || strategy.isPaused) return false;
        if (block.timestamp < strategy.startTime) return false;
        if (strategy.endTime != 0 && block.timestamp >= strategy.endTime) return false;
        
        if (strategy.lastExecution == 0) {
            return block.timestamp >= strategy.startTime;
        }
        
        return block.timestamp >= strategy.lastExecution + strategy.frequency - EXECUTION_WINDOW;
    }

    /**
     * @dev Lấy thông tin chiến lược
     */
    function getDCAStrategy(uint256 strategyId) 
        external 
        view 
        override 
        returns (DCAStrategy memory) 
    {
        return strategies[strategyId];
    }

    /**
     * @dev Lấy danh sách chiến lược của user
     */
    function getUserStrategies(address user) 
        external 
        view 
        override 
        returns (uint256[] memory) 
    {
        return userStrategies[user];
    }

    /**
     * @dev Lấy danh sách chiến lược có thể thực hiện
     */
    function getExecutableStrategies() external view override returns (uint256[] memory) {
        uint256 count = 0;
        uint256[] memory temp = new uint256[](strategyCounter);
        
        for (uint256 i = 1; i <= strategyCounter; i++) {
            if (isExecutable(i)) {
                temp[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }
        
        return result;
    }

    /**
     * @dev Lấy thống kê chiến lược
     */
    function getStrategyStats(uint256 strategyId) 
        external 
        view 
        override 
        returns (
            uint256 totalInvested,
            uint256 totalReceived,
            uint256 averagePrice,
            uint256 executionCount,
            uint256 nextExecution
        ) 
    {
        DCAStrategy memory strategy = strategies[strategyId];
        
        totalInvested = strategy.totalInvested;
        totalReceived = strategy.totalReceived;
        executionCount = strategy.executionCount;
        
        if (totalReceived > 0) {
            averagePrice = (totalInvested * PRECISION) / totalReceived;
        }
        
        if (strategy.lastExecution > 0) {
            nextExecution = strategy.lastExecution + strategy.frequency;
        } else {
            nextExecution = strategy.startTime;
        }
    }

    // Internal functions
    function _calculateTokenAmount(uint256 usdAmount, uint256 goldPrice) 
        internal 
        pure 
        returns (uint256) 
    {
        return (usdAmount * PRECISION) / goldPrice;
    }

    function _executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 expectedAmountOut
    ) internal returns (uint256 amountOut) {
        // Mock implementation - thực tế cần integrate với DEX như Uniswap
        // Hiện tại giả sử tỷ lệ 1:1 để test
        amountOut = expectedAmountOut;
        
        // Mint tokens for testing (chỉ cho testnet)
        // Trong production, sẽ swap thông qua DEX
    }

    // Admin functions
    function setSupportedToken(address token, bool supported) 
        external 
        onlyRole(MANAGER_ROLE) 
    {
        supportedTokens[token] = supported;
        emit TokenSupportUpdated(token, supported);
    }

    function setFees(uint256 _executionFee, uint256 _platformFee) 
        external 
        onlyRole(MANAGER_ROLE) 
    {
        executionFee = _executionFee;
        platformFee = _platformFee;
        emit FeesUpdated(_executionFee, _platformFee);
    }

    function setExecutorReward(uint256 _executorReward) 
        external 
        onlyRole(MANAGER_ROLE) 
    {
        executorReward = _executorReward;
        emit ExecutorRewardUpdated(_executorReward);
    }

    function activateEmergencyMode() external onlyRole(EMERGENCY_ROLE) {
        emergencyMode = true;
        emergencyTimestamp = block.timestamp;
        _pause();
        emit EmergencyModeActivated(block.timestamp);
    }

    function deactivateEmergencyMode() external onlyRole(EMERGENCY_ROLE) {
        emergencyMode = false;
        _unpause();
        emit EmergencyModeDeactivated(block.timestamp);
    }

    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyRole(UPGRADER_ROLE) 
    {}
}
