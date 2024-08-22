/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    'iotaevm-testnet': {
        url: 'https://json-rpc.evm.testnet.iotaledger.net',
        chainId: 1075,
        accounts: [`0x${process.env.PRIVATE_KEY}`]  // Ensure your .env file has PRIVATE_KEY set
    },
},
};
