// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title PentaGoldTimelock
 * @dev Timelock controller for PentaGold governance with 48-hour delay
 */
contract PentaGoldTimelock is TimelockController {
    uint256 public constant MIN_DELAY = 48 hours; // 48-hour minimum delay
    uint256 public constant MAX_DELAY = 30 days;  // 30-day maximum delay

    constructor(
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(MIN_DELAY, proposers, executors, admin) {
        // Constructor automatically sets the minimum delay
    }

    /**
     * @dev Override to return the minimum delay
     */
    function getMinDelay() public view override returns (uint256) {
        return MIN_DELAY;
    }
    
    /**
     * @dev Get the maximum delay
     */
    function getMaxDelay() external pure returns (uint256) {
        return MAX_DELAY;
    }
}