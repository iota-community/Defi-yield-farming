// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IOTAToken is ERC20 {
    constructor() ERC20("IOTAToken", "TST") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
