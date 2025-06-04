// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockDAI
 * @dev Simple ERC20 token to simulate a stablecoin like DAI for testing purposes.
 * 10000000000000000000000 wei = 1,000 DAI
  */
contract MockDAI is ERC20 {
    constructor(uint256 initialSupply) ERC20("MockDAI", "DAI") {
        _mint(msg.sender, initialSupply); // Mint full supply to deployer
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount); // Allow more tokens to be minted manually
    }
}