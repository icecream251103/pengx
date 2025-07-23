// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IDCAManager
 * @dev Interface for DCA (Dollar Cost Averaging) Manager contract
 */
interface IDCAManager {
    // Structs
    struct DCAStrategy {
        address user;
        address paymentToken; // USDC, USDT, etc.
        address targetToken; // PenGx token
        uint256 amount; // Amount to invest per execution
        uint256 frequency; // Execution frequency in seconds
        uint256 startTime; // Strategy start timestamp
        uint256 endTime; // Strategy end timestamp (0 for indefinite)
        uint256 lastExecution; // Last execution timestamp
        uint256 totalInvested; // Total amount invested so far
        uint256 totalReceived; // Total target tokens received
        uint256 executionCount; // Number of executions
        bool isActive; // Strategy status
        bool isPaused; // User can pause/unpause
    }

    struct ExecutionResult {
        uint256 amountIn;
        uint256 amountOut;
        uint256 price;
        uint256 timestamp;
        uint256 gasUsed;
    }

    // Events
    event DCAStrategyCreated(
        uint256 indexed strategyId,
        address indexed user,
        address paymentToken,
        address targetToken,
        uint256 amount,
        uint256 frequency,
        uint256 startTime,
        uint256 endTime
    );

    event DCAStrategyExecuted(
        uint256 indexed strategyId,
        address indexed user,
        uint256 amountIn,
        uint256 amountOut,
        uint256 price,
        uint256 timestamp
    );

    event DCAStrategyPaused(uint256 indexed strategyId, address indexed user);
    event DCAStrategyResumed(uint256 indexed strategyId, address indexed user);
    event DCAStrategyCancelled(uint256 indexed strategyId, address indexed user);
    event DCAStrategyUpdated(uint256 indexed strategyId, address indexed user);

    // Functions
    function createDCAStrategy(
        address paymentToken,
        address targetToken,
        uint256 amount,
        uint256 frequency,
        uint256 startTime,
        uint256 endTime
    ) external returns (uint256 strategyId);

    function executeDCA(uint256 strategyId) external returns (ExecutionResult memory);
    function batchExecuteDCA(uint256[] calldata strategyIds) external;
    
    function pauseDCAStrategy(uint256 strategyId) external;
    function resumeDCAStrategy(uint256 strategyId) external;
    function cancelDCAStrategy(uint256 strategyId) external;
    
    function updateDCAStrategy(
        uint256 strategyId,
        uint256 newAmount,
        uint256 newFrequency,
        uint256 newEndTime
    ) external;

    function getDCAStrategy(uint256 strategyId) external view returns (DCAStrategy memory);
    function getUserStrategies(address user) external view returns (uint256[] memory);
    function getExecutableStrategies() external view returns (uint256[] memory);
    function isExecutable(uint256 strategyId) external view returns (bool);
    
    function getStrategyStats(uint256 strategyId) external view returns (
        uint256 totalInvested,
        uint256 totalReceived,
        uint256 averagePrice,
        uint256 executionCount,
        uint256 nextExecution
    );
}
