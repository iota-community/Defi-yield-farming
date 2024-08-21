import React from 'react';

function StatsCard({ totalLocked, userInvestment, reward }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Pool Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-gray-400">Total Locked</p>
          <p className="text-2xl font-bold">{totalLocked} IOTA</p>
        </div>
        <div>
          <p className="text-gray-400">Your Investment</p>
          <p className="text-2xl font-bold">{userInvestment} IOTA</p>
        </div>

        <div>
          <p className="text-gray-400">Your Reward</p>
          <p className="text-2xl font-bold">{reward} DAP</p>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;