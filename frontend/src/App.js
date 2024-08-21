import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import Navbar from './components/Navbar';
import StakeCard from './components/StakeCard';
import UnstakeCard from './components/UnstakeCard';
import IssueTokensCard from './components/IssueTokensCard';
import StatsCard from './components/StatsCard';
import contractABI from './YieldContractABI';
import {DappTokeABI, DappTokenAddress} from './DappTokenABI';
import {StakeTokenABI, StakeTokenAddress} from './StakeTokenABI';


const contractAddress = "0xDCb82e164f9c8256c96C772BF94c837BF69b12A2";


function App() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [totalLocked, setTotalLocked] = useState(0);
  const [reward, setReward] = useState(0);
  const [userInvestment, setUserInvestment] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          connectWallet();
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
        setSigner(signer);
        setIsConnected(true);
        updateStats(contract, signer, provider);
        updateBalance(signer, provider);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("Please install MetaMask");
    }
  }

  async function updateStats(contract, signer, provider) {
    try {
      const tokenContract = new ethers.Contract(
        DappTokenAddress,
        DappTokeABI,
        signer
      )
      const totalLocked = await tokenContract.balanceOf(contractAddress);
      setTotalLocked(ethers.formatEther(totalLocked));

      const address = await signer.getAddress();
      const userInvestment = await contract.stakingBalance(address);
      setUserInvestment(ethers.formatEther(userInvestment));

      const reward = await tokenContract.balanceOf(address);
      setReward(ethers.formatEther(reward));

      updateBalance(signer)
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  }

  async function updateBalance(signer) {
    try {
      const tokenContract = new ethers.Contract(
        StakeTokenAddress,
        StakeTokenABI,
        signer
      )
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalance(balance);
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar 
        isConnected={isConnected} 
        balance={balance} 
        connectWallet={connectWallet} 
      />
      <div className="container mx-auto px-4 py-8">
        <StatsCard totalLocked={totalLocked} userInvestment={userInvestment} reward={reward}/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StakeCard contract={contract} updateStats={() => updateStats(contract, signer)} signer={signer} contractAddress={contractAddress}/>
          <UnstakeCard contract={contract} updateStats={() => updateStats(contract, signer)} />
          <IssueTokensCard contract={contract} updateStats={() => updateStats(contract, signer)} />
        </div>
      </div>
    </div>
  );
}

export default App;