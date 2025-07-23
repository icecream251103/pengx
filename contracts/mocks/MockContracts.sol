// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockERC20
 * @dev Mock ERC20 token for testing
 */
contract MockERC20 is ERC20, Ownable {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

/**
 * @title MockOracleAggregator
 * @dev Mock Oracle Aggregator for testing
 */
contract MockOracleAggregator {
    uint256 private _price;
    uint256 private _timestamp;

    constructor() {
        _price = 2000 * 1e18; // $2000 per oz
        _timestamp = block.timestamp;
    }

    function getLatestPrice() external view returns (uint256 price, uint256 timestamp) {
        return (_price, _timestamp);
    }

    function setPrice(uint256 price, uint256 timestamp) external {
        _price = price;
        _timestamp = timestamp;
    }
}
