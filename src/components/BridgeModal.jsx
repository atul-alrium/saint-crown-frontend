import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BottomMessage from "./BottomMessage";
import BridgeBtn from "../assets/images/send_actions.png";

const chainIdMap = {
  ethereum: "1",
  polygon: "137",
  arbitrum: "42161",
  bsc: "56",
};

const BridgeModal = ({ visible, onClose }) => {
  const [walletAddress, setWalletAddress] = useState("-");
  const [fromChain, setFromChain] = useState("ETHEREUM");
  const [toChain, setToChain] = useState("POLYGON");
  const [tokenSymbol, setTokenSymbol] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [bottomMessage, setBottomMessage] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch {
        setBottomMessage?.({ message: "Failed to get wallet", type: "error" });
      }
    };

    if (visible) {
      window.hideAllModals?.();
      fetchWallet();
    }
  }, [visible]);

  const performBridge = async () => {
    const wallet = walletAddress;
    if (!wallet)
      return setBottomMessage({
        message: "Wallet not connected",
        type: "error",
      });

    const token = tokenSymbol.trim().toUpperCase();
    const amt = parseFloat(amount);
    const fromKey = fromChain.toLowerCase();
    const toKey = toChain.toLowerCase();

    if (!token || !amt || !fromKey || !toKey) {
      return setBottomMessage({ message: "Fill all fields", type: "error" });
    }

    const fromId = chainIdMap[fromKey];
    const toId = chainIdMap[toKey];

    if (!fromId || !toId) {
      return setBottomMessage({
        message: "Unsupported chain selected",
        type: "error",
      });
    }

    try {
      const [fromTokensRes, toTokensRes] = await Promise.all([
        fetch(`https://li.quest/v1/tokens?chain=${fromKey}`),
        fetch(`https://li.quest/v1/tokens?chain=${toKey}`),
      ]);

      const fromTokens = (await fromTokensRes.json()).tokens?.[fromId] || [];
      const toTokens = (await toTokensRes.json()).tokens?.[toId] || [];

      const fromToken = fromTokens.find(
        (t) => t.symbol?.toUpperCase() === token
      );
      const toToken = toTokens.find((t) => t.symbol?.toUpperCase() === token);

      if (!fromToken || !toToken) {
        return setBottomMessage({
          message: `${token} not supported on both chains`,
          type: "error",
        });
      }

      const amountInWei = BigInt(amt * 10 ** fromToken.decimals).toString();

      const params = new URLSearchParams({
        fromChain: fromId,
        toChain: toId,
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromAddress: wallet,
        toAddress: wallet,
        fromAmount: amountInWei,
        integrator: "your-dapp-name",
        slippage: "1.0",
      });

      const quoteRes = await fetch(
        `https://li.quest/v1/quote?${params.toString()}`
      );
      const quote = await quoteRes.json();

      if (!quoteRes.ok) throw new Error(quote.message || "Failed to get quote");

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [quote.transactionRequest],
      });

      setBottomMessage({
        message: `Bridge started! Tx hash:\n${tx}`,
        type: "success",
      });
      onClose();
    } catch (err) {
      console.error("Bridge error:", err);
      setBottomMessage({
        message: "Bridge failed:\n" + (err.message || err),
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
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold bg-transparent border-none p-0"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-left mb-4">Bridge Tokens</h2>

          <div className="send-modal-main flex flex-wrap send-modal-first">
            <div className="w-full pr-0 pb-[15px] md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-sm font-bold text-gray-800 pb-1">
                Your Wallet
              </label>
              <p className="text-green-600 truncate">{walletAddress}</p>
            </div>

            <div className="w-full pb-[15px] pr-0 md:w-[25%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-sm font-bold text-gray-800 pb-1">
                From Chain
              </label>
              <select
                className="w-full p-2 rounded bg-gray-100 border border-gray-300"
                value={fromChain}
                onChange={(e) => setFromChain(e.target.value)}
              >
                <option value="ETHEREUM">Ethereum</option>
                <option value="POLYGON">Polygon</option>
                <option value="ARBITRUM">Arbitrum</option>
                <option value="BSC">BNB Chain</option>
              </select>
            </div>
            <div className="w-full pr-0 pb-[15px] md:w-[25%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-sm font-bold text-gray-800 pb-1">
                To Chain
              </label>
              <select
                className="w-full p-2 rounded bg-gray-100 border border-gray-300"
                value={toChain}
                onChange={(e) => setToChain(e.target.value)}
              >
                <option value="POLYGON">Polygon</option>
                <option value="ETHEREUM">Ethereum</option>
                <option value="ARBITRUM">Arbitrum</option>
                <option value="BSC">BNB Chain</option>
              </select>
            </div>
          </div>

          <div className="send-modal-main flex flex-wrap">
            <div className="w-full pb-[15px] pr-0 md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-sm font-bold text-gray-800 pb-1">
                Token Symbol
              </label>
              <input
                type="text"
                placeholder="USDC"
                className="w-full p-2 rounded bg-gray-100 border border-gray-300"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
            </div>
            <div className="w-full pr-0 md:w-[45%] md:pr-6 rounded-xl">
              <label className="text-sm font-bold text-gray-800 pb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="0.1"
                className="w-full p-2 rounded bg-gray-100 border border-gray-300"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[5%] ">
            <button
              onClick={performBridge}
              className="rounded-full w-[50px] p-[10px] mt-4 max-w-[150px] bg-[#357bb5] hover:bg-[#2563eb] text-white font-semibold"
            >
              <img src={BridgeBtn} />
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

export default BridgeModal;
