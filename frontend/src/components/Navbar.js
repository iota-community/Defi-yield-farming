import React from 'react';
import { ethers } from 'ethers';

function Navbar({ isConnected, balance, connectWallet}) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">IOTA Yield Farm</h1>
        {isConnected ? (
          <div className="bg-gray-700 px-4 py-2 rounded">
            {ethers.formatEther(balance)} IOTA
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;