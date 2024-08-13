const DappToken = artifacts.require("RewardToken");
const TokenFarm = artifacts.require("YieldFarm");

module.exports = async function(deployer, network, accounts) {
  // Deploy TokenFarm
    const rewardToken = await RewardToken.deployed();
    await deployer.deploy(YieldFarm, rewardToken.address);
    const yieldFarm = await YieldFarm.deployed();
    await rewardToken.transfer(yieldFarm.address, "1000000000000000000000000")
};