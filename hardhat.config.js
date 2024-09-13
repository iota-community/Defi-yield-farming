require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const priv_key = process.env.PRIVATE_KEY || "";
const shimmer_evm_testnet = process.env.SHIMMER_EVM_TESTNET_URL || "";

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
    shimmer_evm_testnet: {
      url: `${shimmer_evm_testnet}`, // Using shimmer evm testnet from the .env file
      chainId: 1073,  // Chain ID for Shimmer EVM testnet
      accounts: [priv_key],  // Using the private key from the .env file
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",  // Your Etherscan API key
    customChains: [
      {
        network: "shimmer_evm_testnet",
        chainId: 1073,
        urls: {
          apiURL: "https://explorer.evm.testnet.shimmer.network/api/",
          browserURL: "https://explorer.evm.testnet.shimmer.network/",
        },
      },
    ],
  },
};