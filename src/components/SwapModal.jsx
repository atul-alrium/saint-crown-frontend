import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BottomMessage from "./BottomMessage";
import SwapBtn from "../assets/images/send_actions.png";

const SwapModal = ({ visible, onClose }) => {
  const [walletAddress, setWalletAddress] = useState("-");
  const [swapAmount, setSwapAmount] = useState("");
  const [bottomMessage, setBottomMessage] = useState(null);
  const [swapToToken, setSwapToToken] = useState(
    "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  );

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (e) {
        setBottomMessage({
          message: "Failed to get wallet address",
          type: "error",
        });
      }
    };

    if (visible) {
      window.hideAllModals?.();
      fetchWallet();
    }
  }, [visible]);

  const performSwap = async () => {
    if (!walletAddress)
      return setBottomMessage({
        message: "Wallet not connected",
        type: "error",
      });
    if (!swapToToken.trim())
      return setBottomMessage({
        message: "Enter a token address (e.g., DAI)",
        type: "error",
      });
    const sellAmountFloat = parseFloat(swapAmount);
    if (!sellAmountFloat || sellAmountFloat <= 0)
      return setBottomMessage({
        message: "Enter a valid ETH amount",
        type: "error",
      });

    const sellAmountWei = ethers.parseEther(sellAmountFloat.toString());

    try {
      const params = new URLSearchParams({
        buyToken: swapToToken.trim(),
        sellToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
        sellAmount: sellAmountWei.toString(),
        taker: walletAddress,
      });

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/swap-quote?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch swap quote");

      const quote = await res.json();

      const txParams = {
        from: walletAddress,
        to: quote.transaction.to,
        data: quote.transaction.data,
        value: quote.transaction.value,
        gas: quote.transaction.gas,
        gasPrice: quote.transaction.gasPrice,
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });

      setBottomMessage({
        message: `Swap executed!\nTx Hash: ${txHash}`,
        type: "success",
      });
      onClose();
    } catch (e) {
      console.error("Swap failed", e);
      setBottomMessage({
        message: "Swap failed:\n" + (e.message || e),
        type: "error",
      });
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="w-full mt-10">
        <div className="relative rounded-2xl p-6 text-gray-900 shadow-inner  w-[90%] md:w-[73.8%] m-auto bg-[#E2F3F9]">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold bg-transparent border-none p-0"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-left mb-4">
            Swap ETH to Token
          </h2>

          <div className="send-modal-main flex flex-wrap">
            <div className="w-full pr-0 pb-[15px] md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
              <label className="block text-base font-bold text-gray-800 pb-1 ">
                Your Wallet
              </label>
              <p className="text-sm text-green-600 truncate">{walletAddress}</p>
            </div>

            <div className="w-full pr-0 pb-[15px] md:w-[22.5%] md:pr-6 md:pb-0 rounded-xl">
              <label className="block text-base font-bold text-gray-800 pb-1 ">
                Amount in ETH
              </label>
              <input
                type="number"
                className="w-full text-sm p-2 rounded bg-gray-100 border border-gray-300"
                placeholder="0.01"
                min="0"
                step="any"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
              />
            </div>

            <div className="w-full pr-0 md:w-[22.5%] md:pr-6 rounded-xl">
              <label className="block text-base font-bold text-gray-800 pb-1 ">
                Token to Receive
              </label>
              <input
                type="text"
                value={swapToToken}
                onChange={(e) => setSwapToToken(e.target.value)}
                className="w-full text-sm p-2 rounded bg-gray-100 border border-gray-300"
                placeholder="e.g. DAI, USDC or token address"
              />
            </div>
            <div className="w-[5%]">
              <button
                onClick={performSwap}
                className="rounded-full w-[50px] p-[10px] mt-4 max-w-[150px] bg-[#357bb5] hover:bg-[#2563eb] text-white font-semibold"
              >
                <img src={SwapBtn} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {bottomMessage && (
        <BottomMessage
          message={bottomMessage.message}
          type={bottomMessage.type}
          onClose={() => setBottomMessage(null)}
        />
      )}
    </>
  );
};

export default SwapModal;
