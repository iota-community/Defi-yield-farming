// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YieldFarm
 * @dev A contract for staking ERC20 tokens and earning rewards.
 */
contract YieldFarm is Ownable{

    /// @notice The name of the yield farm.
    string public name = "Reward Token Farm";
    
    /// @notice The ERC20 reward token.
    IERC20 public rewardToken;

    /// @notice List of stakers.
    address[] public stakers;
    
    /// @notice Mapping of token address to staker address to staking balance.
    mapping(address => mapping(address => uint256)) public stakingBalance;
    
    /// @notice Mapping of staker address to the number of unique tokens staked.
    mapping(address => uint256) public uniqueTokensStaked;
    
    /// @notice Mapping of token address to price feed address.
    mapping(address => address) public tokenPriceFeedMapping;

    /// @notice List of allowed tokens for staking.
    address[] allowedTokens;

    /**
     * @notice Constructor to initialize the reward token.
     * @param _rewardTokenAddress The address of the reward token contract.
     */
    constructor(address _rewardTokenAddress) public {
        rewardToken = IERC20(_rewardTokenAddress);
    }

    /**
     * @notice Adds a token to the list of allowed tokens.
     * @param token The address of the token to be added.
     */
    function addAllowedTokens(address token) public onlyOwner {
        allowedTokens.push(token);
    }

    /**
     * @notice Sets the price feed contract for a specific token.
     * @param token The address of the token.
     * @param priceFeed The address of the price feed contract.
     */
    function setPriceFeedContract(address token, address priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[token] = priceFeed;
    }

    /**
     * @notice Stakes tokens in the yield farm.
     * @param _amount The amount of tokens to stake.
     * @param token The address of the token to stake.
     */
    function stakeTokens(uint256 _amount, address token) public {

        require(_amount > 0, "amount should be greater than zero");
        if(tokenIsAllowed(token)){
            updateUniqueTokensStaked(msg.sender, token);
            IERC20(token).transferFrom(msg.sender, address(this), _amount);
            stakingBalance[token][msg.sender] = stakingBalance[token][msg.sender] + _amount;
            if(uniqueTokensStaked[msg.sender] == 1){
                stakers.push(msg.sender);
            }
        }
    }

    /**
     * @notice Unstakes tokens from the yield farm.
     * @param token The address of the token to unstake.
     */
    function unstakeTokens(address token) public {
        uint256 balance = stakingBalance[token][msg.sender];
        require(balance > 0, "staking balance cannot be 0");
        IERC20(token).transfer(msg.sender, balance);
        stakingBalance[token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    /**
     * @notice Gets the total value of staked tokens for a user.
     * @param user The address of the user.
     * @return The total value of staked tokens.
     */
    function getUserTotalValue(address user) public view returns (uint256) {
        uint256 totalValue = 0;
        if (uniqueTokensStaked[user] > 0) {
            for (
                uint256 allowedTokensIndex = 0;
                allowedTokensIndex < allowedTokens.length;
                allowedTokensIndex++
            ) {
                totalValue =
                    totalValue +
                    getUserStakingBalanceEthValue(
                        user,
                        allowedTokens[allowedTokensIndex]
                    );
            }
        }
        return totalValue;
    }

    /**
     * @notice Checks if a token is allowed for staking.
     * @param token The address of the token.
     * @return True if the token is allowed, false otherwise.
     */
    function tokenIsAllowed(address token) public returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == token) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Updates the number of unique tokens staked by a user.
     * @param user The address of the user.
     * @param token The address of the token.
     */
    function updateUniqueTokensStaked(address user, address token) internal {
        if (stakingBalance[token][user] <= 0) {
            uniqueTokensStaked[user] = uniqueTokensStaked[user] + 1;
        }
    }

    /**
     * @notice Gets the ETH value of a user's staked tokens.
     * @param user The address of the user.
     * @param token The address of the token.
     * @return The ETH value of the staked tokens.
     */
    function getUserStakingBalanceEthValue(address user, address token)
        public
        view
        returns (uint256)
    {
        if (uniqueTokensStaked[user] <= 0) {
            return 0;
        }
        return
            (stakingBalance[token][user] * getTokenEthPrice(token)) / (10**18);
    }
}
