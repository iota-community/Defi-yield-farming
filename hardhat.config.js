require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const priv_key = process.env.PRIVATE_KEY || "";
const iota_evm_testnet = process.env.IOTA_EVM_TESTNET_URL || "";

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,  // Optimization runs for gas efficiency
      },
      viaIR: true,  // Enable intermediate representation
    },
  },
  networks: {
    iota_evm_testnet: {
      url: `${iota_evm_testnet}`, // Using iota evm testnet from the .env file
      chainId: 1076,  // Chain ID for IOTA EVM testnet
      accounts: [priv_key],  // Using the private key from the .env file
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",  // Your Etherscan API key
    customChains: [
      {
        network: "iota_evm_testnet",
        chainId: 1073,
        urls: {
          apiURL: "https://explorer.evm.testnet.iota.cafe",
          browserURL: "https://explorer.evm.testnet.iota.cafe",
        },
      },
    ],
  },
};