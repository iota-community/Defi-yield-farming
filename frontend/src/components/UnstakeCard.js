import React from 'react';

function UnstakeCard({ contract, updateStats }) {
  async function handleUnstake() {
    if (!contract) return;
    try {
      const tx = await contract.unstakeTokens();
      await tx.wait();
      updateStats();
    } catch (error) {
      console.error("Failed to unstake tokens:", error);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Unstake Tokens</h2>
      <button
        onClick={handleUnstake}
        className="w-full bg-red-500 hover:bg-red-600 p-2 rounded"
      >
        Unstake
      </button>
    </div>
  );
}

export default UnstakeCard;