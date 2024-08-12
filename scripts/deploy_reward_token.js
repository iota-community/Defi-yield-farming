const { ethers } = require("hardhat");

async function main(){
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    const rewardToken = await ethers.deployContract("RewardToken");

    console.log("Reward Token contract deployed to:", await rewardToken.getAddress());

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
    });