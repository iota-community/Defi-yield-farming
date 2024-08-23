// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./DappToken.sol"; // Import the DappToken contract
import "./IOTAToken.sol"; // Import the IOTAToken contract
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Import the ERC20 interface from OpenZeppelin
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import "@pythnetwork/pyth-sdk-solidity/PythUtils.sol";

/**
 * @title IOTA Yield Farming Contract
 * @notice This contract allows users to stake IOTATokens and earn rewards in DappTokens
 * @dev Implements staking, unstaking, and reward distribution mechanisms
 */
contract TokenFarm {
    IPyth pyth;

    /// @notice Name of the yield farm
    string public name = "IOTA Yield Farm";

    /// @notice Address of the contract owner
    address public owner;

    /// @notice Instance of the DappToken contract (reward token)
    DappToken public dappToken;

    /// @notice Instance of the IOTAToken contract (staking token)
    IOTAToken public iotaToken;

    /// @notice Timestamp of the last reward issuance
    uint256 public lastReward;

    /// @notice Array to store addresses of all stakers
    address[] public stakers;

    /// @notice Mapping to store the staking balance of each staker
    mapping(address => uint256) public stakingBalance;

    /// @notice Mapping to track if an address has previously staked
    mapping(address => bool) public hasStaked;

    /// @notice Mapping to track if an address is currently staking
    mapping(address => bool) public isStaking;

    /**
     * @notice Constructor to initialize the contract with the reward and staking token addresses
     * @param _dappToken Address of the DappToken contract
     * @param _iotaToken Address of the IOTAToken contract
     */
    constructor(
        DappToken _dappToken,
        IOTAToken _iotaToken,
        address pythContract
    ) {
        dappToken = _dappToken;
        iotaToken = _iotaToken;
        owner = msg.sender;
        pyth = IPyth(pythContract);
    }

    /**
     * @notice Stake IOTATokens in the contract
     * @dev Transfers the specified amount of IOTATokens from the sender's address to the contract
     * @param _amount The number of IOTATokens to stake
     */
    function stakeTokens(uint256 _amount) public payable {
        // Transfer the specified amount of IOTATokens from the user's wallet to the contract
        iotaToken.transferFrom(msg.sender, address(this), _amount);

        // Update the user's staking balance
        stakingBalance[msg.sender] += _amount;

        // If the user has not staked before, add them to the stakers array
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true; // Mark the user as currently staking
        hasStaked[msg.sender] = true; // Mark the user as having staked before
    }

    /**
     * @notice Unstake IOTATokens and withdraw them from the contract
     * @dev Transfers the staked IOTATokens back to the sender's address
     */
    function unstakeTokens() public {
        // Fetch the user's staking balance
        uint256 balance = stakingBalance[msg.sender];

        // Ensure the user's balance is greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer the staked tokens back to the user
        iotaToken.transfer(msg.sender, balance);

        // Reset the user's staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false; // Mark the user as no longer staking
    }

    /**
     * @dev Fetches the current price of IOTA in USD from the Pyth Oracle network.
     * @param priceUpdate An array of price update data required by the Pyth Oracle.
     * @return iotaToUsdPrice The current price of IOTA in USD with 18 decimal places.
     */
    function getIotaToUsdPriceFeed(
        bytes[] calldata priceUpdate
    ) public payable returns (uint256) {
        // Calculate the fee required to fetch the price update from the Pyth Oracle.
        uint fee = pyth.getUpdateFee(priceUpdate);

        // Update the price feeds in the Pyth Oracle with the provided update data.
        pyth.updatePriceFeeds{value: fee}(priceUpdate);

        // Define the unique identifier for the IOTA/USD price feed in the Pyth Oracle.
        bytes32 priceFeedId = 0xc7b72e5d860034288c9335d4d325da4272fe50c92ab72249d58f6cbba30e4c44;

        // Fetch the price of IOTA/USD from the Pyth Oracle, ensuring the price is not older than 60 seconds.
        PythStructs.Price memory price = pyth.getPriceNoOlderThan(
            priceFeedId,
            60
        );

        // @dev Convert the fetched price to an unsigned integer with 18 decimal places.
        uint256 iotaToUsdPrice = PythUtils.convertToUint(
            price.price,
            price.expo,
            18
        );

        // @dev Return the current price of IOTA in USD.
        return iotaToUsdPrice;
    }

    /**
     * @notice Issue rewards to all stakers
     * @dev Only the contract owner can call this function, and rewards are issued once every 60 minutes
     */
    function issueTokens(bytes[] calldata priceUpdate) public {
        // Ensure that only the contract owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Ensure that rewards can only be issued once every 60 minutes
        require(
            block.timestamp - lastReward > 60 minutes,
            "Need to wait 60 minutes"
        );

        // Fetch the current IOTA/USD price from the Pyth Oracle.
        uint256 iotaToUSDPrice = getIotaToUsdPriceFeed(priceUpdate);


        // Loop through all stakers and distribute rewards based on their staked amount
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i]; // Get the address of the staker
            uint256 balance = stakingBalance[recipient]; // Get the staker's balance

            // If the staker has a non-zero balance, issue rewards
            if (balance > 0) {
                // Calculate the reward based on the staked value in USD
                uint256 stakedBalanceinUSD = (balance * iotaToUSDPrice) /
                    10 ** 18;

                // Determine reward amount, e.g., 5% of the staked value in USD
                uint256 reward = (stakedBalanceinUSD * 5) / 100;

                // Transfer the reward to the staker
                dappToken.transfer(
                    recipient,
                    reward * 10 ** dappToken.decimals()
                );
            }
        }

        // Update the timestamp of the last reward issuance
        lastReward = block.timestamp;
    }

    // Get the number of dapp tokens in the pool
    function dappTokenBalance() public view returns(uint256){
        return dappToken.balanceOf(address(this));
    }

    // Get the number of iota tokens in the pool
    function iotaTokenBalance() public view returns(uint256){
        return iotaToken.balanceOf(address(this));
    }
}
