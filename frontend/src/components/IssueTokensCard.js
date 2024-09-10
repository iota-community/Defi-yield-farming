import React from 'react';

function IssueTokensCard({ contract, updateStats }) {
  async function handleIssueTokens() {
    if (!contract) return;
    try {
      const tx = await contract.issueTokens();
      await tx.wait();
      updateStats();
    } catch (error) {
      console.error("Failed to issue tokens:", error);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Issue Tokens (Owner Only)</h2>
      <button
        onClick={handleIssueTokens}
        className="w-full bg-yellow-500 hover:bg-yellow-600 p-2 rounded"
      >
        Issue Tokens
      </button>
    </div>
  );
}

export default IssueTokensCard;