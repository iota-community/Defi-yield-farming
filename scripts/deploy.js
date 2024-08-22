async function main() {
  const DappToken = await ethers.getContractFactory("DappToken");
  const IOTAToken = await ethers.getContractFactory("IOTAToken");
  const TokenFarm = await ethers.getContractFactory("TokenFarm");

  const dappToken = await DappToken.deploy();
  await dappToken.deployed();
  console.log("DappToken deployed to:", dappToken.address);

  const iotaToken = await IOTAToken.deploy();
  await iotaToken.deployed();
  console.log("IOTAToken deployed to:", iotaToken.address);

  const tokenFarm = await TokenFarm.deploy(dappToken.address, iotaToken.address, "PYTH_ORACLE_CONTRACT_ADDRESS");
  await tokenFarm.deployed();
  console.log("TokenFarm deployed to:", tokenFarm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
