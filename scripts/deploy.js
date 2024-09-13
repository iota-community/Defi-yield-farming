const hre = require("hardhat");
// Set the Pyth Oracle contract address
const PYTH_ORACLE_CONTRACT_ADDRESS = "0x8D254a21b3C86D32F7179855531CE99164721933";


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying contracts with the account:",
    deployer.address
    );
  // Deploy DappToken contract
  DappToken = await ethers.deployContract("DappToken",signer=deployer);
  await DappToken.waitForDeployment();
  console.log("DappToken deployed to:", DappToken.target);

  // Deploy IOTAToken contract
  IOTAToken = await ethers.deployContract("IOTAToken",signer=deployer);
  await IOTAToken.waitForDeployment();
  console.log("IOTAToken deployed to:", IOTAToken.target);

  // Deploy PythUtils lib

  pythLib = await ethers.deployContract("PythUtils", signer=deployer);
  await pythLib.waitForDeployment();
  console.log("PythUtils deployed at ", pythLib.target);
  

  // Deploy TokenFarm contract
  const TokenFarm = await ethers.getContractFactory("TokenFarm", {
    libraries: {
      PythUtils: pythLib.target,
    }, 
  })
  const tokenFarmInstance = (await TokenFarm.connect(deployer).deploy(
    DappToken.target,
    IOTAToken.target,
    PYTH_ORACLE_CONTRACT_ADDRESS
  ));
  await tokenFarmInstance.waitForDeployment();
  const tokenFarmAddress = await tokenFarmInstance.getAddress();
  console.log("TokenFarm deployed to:", tokenFarmAddress);

  // Trasfer all the DAPP token to the smart contract
  const totalSupply = await DappToken.totalSupply()
  await DappToken.transfer(tokenFarmAddress, totalSupply)

  // Optional: Additional logic for verifying deployment or interacting with the contracts can be added here.
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
