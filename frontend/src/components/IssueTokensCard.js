import React from 'react';
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

const hermesUrl = "https://hermes.pyth.network";
const iotaToUsdPriceFeedId = "0xc7b72e5d860034288c9335d4d325da4272fe50c92ab72249d58f6cbba30e4c44";

function IssueTokensCard({ contract, updateStats }) {
  async function handleIssueTokens() {
    if (!contract) return;
    try {
      const pythPriceService = new EvmPriceServiceConnection(hermesUrl);
      const priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
        iotaToUsdPriceFeedId,
      ]);
      //console.log(priceFeedUpdateData);
      const tx = await contract.issueTokens(priceFeedUpdateData);
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