# Yield Farming with Dynamic Rewards on IOTA EVM using Pyth Price Feeds

This project demonstrates a decentralized yield farming application built on the IOTA EVM Testnet, using Solidity smart contracts. It allows users to stake ERC20 Tokens, earn dynamic rewards in DappTokens, and withdraw their staked assets. The reward distribution leverages real-time IOTA/USD token prices fetched using Pyth Network to calculate dynamic reward amounts.

## Project Structure

```bash
/root-project-directory
├── README.md                         # Project overview and instructions.
├── contracts                         # Folder containing all the Solidity smart contracts.
│   ├── DappToken.sol                 # ERC20 contract for DappToken.
│   ├── IOTAToken.sol                 # ERC20 contract for IOTAToken.
│   └── TokenFarm.sol                 # Main smart contract for the Yield Farming mechanism.
├── frontend                          # React-based frontend folder to interact with the smart contracts.
│   ├── README.md                     # Frontend project documentation and instructions.
│   ├── package-lock.json             # Auto-generated file locking versions of node modules.
│   ├── package.json                  # List of project dependencies and scripts for the frontend.
│   ├── public                        # Static assets served by the frontend.
│   ├── src                           # Source code of the frontend application.
│   └── tailwind.config.js            # Configuration for Tailwind CSS in the frontend.
├── hardhat.config.js                 # Hardhat configuration file for the project.
├── package-lock.json                 # Dependency lock file for the overall project.
├── package.json                      # Project's metadata and dependencies for the overall environment.
├── scripts                           # Folder containing Hardhat scripts for deployment and management.
│   └── deploy.js                     # Deployment script for deploying the smart contracts to the blockchain.
└── test                              # Folder containing test files for the smart contracts.
                                      # (no specific test files listed here, but expected to contain test cases)
```

## Features

- Staking & Unstaking: Users can stake IOTATokens and later unstake them.
- Dynamic Rewards: Rewards are issued in DappTokens, calculated based on the real-time price of IOTA/USD using Pyth Oracle Network.
- Oracle Integration: Fetch live IOTA/USD price data from Pyth Oracles to determine reward amounts.
- React Frontend: Users can interact with the smart contracts via a React frontend to stake, unstake, and issue rewards.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or later)
- Hardhat
- MetaMask (for interacting with the IOTA EVM Testnet)
- API Key for Pyth Oracles (if needed for price data fetching)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/iota-community/Defi-yield-farming.git
cd Defi-yield-farming
```

### 2. Install Dependencies

Install all necessary dependencies for both the backend (smart contracts) and the frontend.

```bash
npm install         # Install dependencies for the hardhat project
cd frontend
npm install         # Install dependencies for the React frontend
```

### 3. Configure Environment Variables

Create a `.env` file at the root of your project and include the following:

```bash
# .env
PRIVATE_KEY=your-private-key
IOTA_EVM_TESTNET_URL=https://json-rpc.evm.testnet.iota.network
```

### 4. Deploy the Contracts

Use Hardhat to compile and deploy the contracts on IOTA EVM testnet.

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network iota_evm_testnet
```

### 5. Run the Frontend

Navigate to the `/frontend` directory and start the React development server.

```bash
cd frontend
npm start
```
Open your browser at http://localhost:3000 to interact with the app.

## Contributing

Contributions are welcome! Please follow the standard GitHub process for opening issues, creating pull requests, and contributing code.

- Fork the repository
- Create a new branch (git checkout -b feature/your-feature)
- Commit your changes (git commit -m 'Add some feature')
- Push to the branch (git push origin feature/your-feature)
- Open a pull request

### License

This project is licensed under the MIT License.

