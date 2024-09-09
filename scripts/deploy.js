const hre = require("hardhat");
// Set the Pyth Oracle contract address
const PYTH_ORACLE_CONTRACT_ADDRESS = "0x8D254a21b3C86D32F7179855531CE99164721933";


async function main() {
  // Deploy DappToken contract
  const DappToken = await hre.ethers.getContractFactory("DappToken");
  const dappTokenInstance = await DappToken.deploy();
  await dappTokenInstance.deployed();
  const dappTokenAddress = await dappTokenInstance.address;
  console.log("DappToken deployed to:", dappTokenAddress);

  // Deploy IOTAToken contract
  const IOTAToken = await hre.ethers.getContractFactory("IOTAToken");
  const iotaTokenInstance = await IOTAToken.deploy();
  await iotaTokenInstance.deployed();
  const iotaTokenAddress = await iotaTokenInstance.address;
  console.log("IOTAToken deployed to:", iotaTokenAddress);

  // Deploy TokenFarm contract
  const TokenFarm = await hre.ethers.getContractFactory("TokenFarm");
  const tokenFarmInstance = await TokenFarm.deploy(
    dappTokenAddress,
    iotaTokenAddress,
    PYTH_ORACLE_CONTRACT_ADDRESS
  );
  await tokenFarmInstance.deployed();
  const tokenFarmAddress = tokenFarmInstance.address;
  console.log("TokenFarm deployed to:", tokenFarmAddress);

  // Optional: Additional logic for verifying deployment or interacting with the contracts can be added here.
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
