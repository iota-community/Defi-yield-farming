pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20{
    constructor() public ERC20("Reward Token", "RT") {
    _mint(msg.sender, 1000000000000000000000000);
    }
}