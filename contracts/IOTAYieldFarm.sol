// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISupraSValueFeed.sol";

interface ISupraSValueFeed {
    struct priceFeed {
        uint256 round;
        uint256 decimals;
        uint256 time;
        uint256 price;
    }
    function getSvalue(uint256 _pairIndex) external view returns(priceFeed memory);
}

/**
 * @title IOTAYieldFarm
 * @dev A contract for staking IOTA tokens and earning rewards based on IOTA/USDT price.
 */
contract IOTAYieldFarm is Ownable {
    ISupraSValueFeed internal sValueFeed;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsIssued(address indexed user, uint256 reward);

    string public name = "IOTA Yield Farm";

    // Mapping of staker address to staking balance
    mapping(address => uint256) public stakingBalance;
    
    // List of stakers
    address[] public stakers;
    
    // Mapping to check if an address is a staker
    mapping(address => bool) public hasStaked;

    // Supra price feed pair index for IOTA/USDT
    uint256 public iotaUsdtPairIndex = 171;

    constructor() public {
        sValueFeed = ISupraSValueFeed(0x2FA6DbFe4291136Cf272E1A3294362b6651e8517);
    }

    /**
     * @notice Stakes IOTA tokens in the yield farm.
     */
    function stakeIOTA() public payable {
        require(msg.value > 0, "amount should be greater than zero");

        stakingBalance[msg.sender] += msg.value;
        
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }

        emit Staked(msg.sender, msg.value);
    }

    /**
     * @notice Unstakes IOTA tokens from the yield farm.
     */
    function unstakeIOTA() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be 0");

        stakingBalance[msg.sender] = 0;
        payable(msg.sender).transfer(balance);

        emit Unstaked(msg.sender, balance);
    }

    /**
     * @notice Issues rewards to all stakers based on the IOTA/USDT price.
     */
    function issueRewards() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 reward = calculateReward(recipient);
            if (reward > 0) {
                payable(recipient).transfer(reward);
                emit RewardsIssued(recipient, reward);
            }
        }
    }

    /**
     * @notice Calculates the reward for a user based on the IOTA/USDT price.
     * @param user The address of the user.
     * @return The reward amount in IOTA.
     */
    function calculateReward(address user) public view returns (uint256) {
        uint256 stakingBalanceIOTA = stakingBalance[user];
        ISupraSValueFeed.priceFeed memory priceData = sValueFeed.getSvalue(iotaUsdtPairIndex);

        // Calculate reward based on the price of IOTA in USDT
        uint256 iotaPriceInUSDT = priceData.price;
        uint256 rewardInIOTA = (stakingBalanceIOTA * iotaPriceInUSDT) / (10**priceData.decimals);

        return rewardInIOTA;
    }

    /**
     * @notice Gets the current price of IOTA in USDT from Supra Oracle.
     * @return The price of IOTA in USDT.
     */
    function getIOTAPriceInUSDT() public view returns (uint256) {
        ISupraSValueFeed.priceFeed memory priceData = sValueFeed.getSvalue(iotaUsdtPairIndex);
        return priceData.price;
    }
}