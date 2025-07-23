// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDCAManager.sol";

/**
 * @title DCAAutomationBot
 * @dev Bot tự động thực hiện các chiến lược DCA
 * @author PentaGold Team
 */
contract DCAAutomationBot is AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // State variables
    IDCAManager public dcaManager;
    uint256 public executionReward;
    uint256 public maxGasLimit;
    uint256 public minExecutionInterval;
    uint256 public lastExecutionTime;
    bool public isActive;

    // Automation settings
    uint256 public batchSize;
    uint256 public maxExecutionsPerBatch;
    mapping(address => bool) public authorizedExecutors;

    // Events
    event BotActivated(uint256 timestamp);
    event BotDeactivated(uint256 timestamp);
    event BatchExecutionCompleted(uint256 strategiesExecuted, uint256 gasUsed);
    event ExecutionRewardUpdated(uint256 newReward);
    event ExecutorAuthorized(address executor);
    event ExecutorDeauthorized(address executor);

    // Errors
    error BotNotActive();
    error UnauthorizedExecutor();
    error TooSoon();
    error InvalidGasLimit();
    error NoStrategiesToExecute();

    constructor(
        address _dcaManager,
        uint256 _executionReward,
        uint256 _maxGasLimit,
        uint256 _batchSize
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);

        dcaManager = IDCAManager(_dcaManager);
        executionReward = _executionReward;
        maxGasLimit = _maxGasLimit;
        batchSize = _batchSize;
        maxExecutionsPerBatch = 50;
        minExecutionInterval = 5 minutes;
        isActive = true;

        authorizedExecutors[msg.sender] = true;
    }

    /**
     * @dev Thực hiện tự động các chiến lược DCA có thể thực hiện
     */
    function executeBatch() external nonReentrant {
        if (!isActive) revert BotNotActive();
        if (!authorizedExecutors[msg.sender]) revert UnauthorizedExecutor();
        if (block.timestamp < lastExecutionTime + minExecutionInterval) revert TooSoon();
        if (gasleft() < maxGasLimit) revert InvalidGasLimit();

        uint256 gasStart = gasleft();
        
        // Lấy danh sách strategies có thể thực hiện
        uint256[] memory executableStrategies = dcaManager.getExecutableStrategies();
        
        if (executableStrategies.length == 0) revert NoStrategiesToExecute();

        // Giới hạn số lượng strategies trong một batch
        uint256 executionCount = executableStrategies.length > batchSize 
            ? batchSize 
            : executableStrategies.length;
        
        if (executionCount > maxExecutionsPerBatch) {
            executionCount = maxExecutionsPerBatch;
        }

        // Tạo array cho batch execution
        uint256[] memory strategiesToExecute = new uint256[](executionCount);
        for (uint256 i = 0; i < executionCount; i++) {
            strategiesToExecute[i] = executableStrategies[i];
        }

        // Thực hiện batch execution
        dcaManager.batchExecuteDCA(strategiesToExecute);

        lastExecutionTime = block.timestamp;
        uint256 gasUsed = gasStart - gasleft();

        emit BatchExecutionCompleted(executionCount, gasUsed);
    }

    /**
     * @dev Thực hiện một strategy cụ thể
     */
    function executeSingleStrategy(uint256 strategyId) external nonReentrant {
        if (!isActive) revert BotNotActive();
        if (!authorizedExecutors[msg.sender]) revert UnauthorizedExecutor();

        dcaManager.executeDCA(strategyId);
    }

    /**
     * @dev Lấy danh sách strategies có thể thực hiện
     */
    function getExecutableStrategies() external view returns (uint256[] memory) {
        return dcaManager.getExecutableStrategies();
    }

    /**
     * @dev Kiểm tra xem có strategies nào cần thực hiện không
     */
    function needsExecution() external view returns (bool, uint256) {
        uint256[] memory executableStrategies = dcaManager.getExecutableStrategies();
        return (executableStrategies.length > 0, executableStrategies.length);
    }

    /**
     * @dev Ước tính gas cần thiết cho batch execution
     */
    function estimateGasForBatch(uint256 batchSize_) external view returns (uint256) {
        // Ước tính gas cho mỗi execution: ~200k gas
        uint256 gasPerExecution = 200000;
        uint256 baseGas = 50000; // Gas cơ bản cho batch
        
        return baseGas + (gasPerExecution * batchSize_);
    }

    // Admin functions
    function activateBot() external onlyRole(MANAGER_ROLE) {
        isActive = true;
        emit BotActivated(block.timestamp);
    }

    function deactivateBot() external onlyRole(MANAGER_ROLE) {
        isActive = false;
        emit BotDeactivated(block.timestamp);
    }

    function setExecutionReward(uint256 _executionReward) external onlyRole(MANAGER_ROLE) {
        executionReward = _executionReward;
        emit ExecutionRewardUpdated(_executionReward);
    }

    function setBatchSize(uint256 _batchSize) external onlyRole(MANAGER_ROLE) {
        batchSize = _batchSize;
    }

    function setMaxGasLimit(uint256 _maxGasLimit) external onlyRole(MANAGER_ROLE) {
        maxGasLimit = _maxGasLimit;
    }

    function setMinExecutionInterval(uint256 _interval) external onlyRole(MANAGER_ROLE) {
        minExecutionInterval = _interval;
    }

    function authorizeExecutor(address executor) external onlyRole(MANAGER_ROLE) {
        authorizedExecutors[executor] = true;
        emit ExecutorAuthorized(executor);
    }

    function deauthorizeExecutor(address executor) external onlyRole(MANAGER_ROLE) {
        authorizedExecutors[executor] = false;
        emit ExecutorDeauthorized(executor);
    }

    function updateDCAManager(address _dcaManager) external onlyRole(MANAGER_ROLE) {
        dcaManager = IDCAManager(_dcaManager);
    }

    // Emergency functions
    function emergencyWithdraw(address token, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).transfer(msg.sender, amount);
    }

    function emergencyCall(address target, bytes calldata data) external onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool success,) = target.call(data);
        require(success, "Emergency call failed");
    }
}
