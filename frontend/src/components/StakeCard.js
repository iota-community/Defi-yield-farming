import React, { useState } from 'react';
import { ethers } from 'ethers';
import { StakeTokenABI, StakeTokenAddress } from '../StakeTokenABI';

function StakeCard({ contract, updateStats, signer, contractAddress}) {
  const [amount, setAmount] = useState('');

  async function handleStake() {
    if (!contract) return;
    try {
        const token = new ethers.Contract(
            StakeTokenAddress,
            StakeTokenABI,
            signer
        )
        const tx = await token.approve(contractAddress,  ethers.parseEther(amount))
        await tx.wait()
    } catch (error) {
        console.error('error: ', error)
    }

    try {
      const tx = await contract.stakeTokens(ethers.parseEther(amount));
      await tx.wait();
      updateStats();
      setAmount('');
    } catch (error) {
      console.error("Failed to stake tokens:", error);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Stake Tokens</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-gray-700 text-white p-2 rounded mb-4"
        placeholder="Amount to stake"
      />
      <button
        onClick={handleStake}
        className="w-full bg-green-500 hover:bg-green-600 p-2 rounded"
      >
        Stake
      </button>
    </div>
  );
}

export default StakeCard;