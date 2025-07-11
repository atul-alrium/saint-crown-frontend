import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BottomMessage from "./BottomMessage";
import SellBtn from "../assets/images/send_actions.png";

const SellModal = ({ visible, onClose }) => {
  const [walletAddress, setWalletAddress] = useState("-");
  const [sellAmount, setSellAmount] = useState("");
  const [sellToken, setSellToken] = useState("USDC");
  const [bottomMessage, setBottomMessage] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (err) {
        setBottomMessage?.({
          message: "Failed to fetch wallet address",
          type: "error",
        });
      }
    };

    if (visible) {
      window.hideAllModals?.();
      fetchWallet();
    }
  }, [visible]);

  const handleSell = () => {
    if (!walletAddress) {
      setBottomMessage({ message: "Wallet not connected", type: "error" });
      return;
    }

    if (!sellToken.trim()) {
      setBottomMessage({
        message: "Enter token name (e.g., USDC)",
        type: "error",
      });
      return;
    }

    const amount = parseFloat(sellAmount);
    if (!amount || amount <= 0) {
      setBottomMessage({ message: "Enter a valid amount", type: "error" });
      return;
    }

    // You can place your actual sell logic here.
    console.log(
      `Selling ${amount} of ${sellToken} from wallet ${walletAddress}`
    );
    setBottomMessage({
      message: "Sell transaction simulated!",
      type: "success",
    });
    onClose(); // Close modal after "selling"
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

          <h2 className="text-2xl font-bold text-left mb-4">Sell Crypto</h2>

          <div className="send-modal-main flex flex-wrap">
            <div className="w-full pr-0 pb-[15px] md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
              <label className="block text-base font-bold text-gray-800 pb-1 ">
                Your Wallet
              </label>
              <p className="text-sm text-green-600 truncate">{walletAddress}</p>
            </div>

            <div className="w-full pr-0 pb-[15px] md:w-[22.5%] md:pr-6 md:pb-0 rounded-xl">
              <label className="block text-base font-bold text-gray-800 pb-1 ">
                Amount
              </label>
              <input
                type="number"
                className="w-full p-2 text-sm rounded bg-gray-100 border border-gray-300"
                placeholder="0.1"
                min="0"
                step="any"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
            </div>

            <div className="w-full pr-0 pb-0 md:w-[22.5%] md:pr-6 md:pb-0 rounded-xl">
              <label className="block text-base font-bold text-gray-800 pb-1 ">
                Token (e.g. USDC)
              </label>
              <input
                type="text"
                className="w-full p-2 text-sm rounded bg-gray-100 border border-gray-300"
                placeholder="USDC"
                value={sellToken}
                onChange={(e) => setSellToken(e.target.value)}
              />
            </div>
            <div className="w-[5%]">
              <button
                onClick={handleSell}
                className="rounded-full w-[50px] p-[10px] mt-4 max-w-[150px] bg-[#357bb5] hover:bg-[#2563eb] text-white font-semibold"
              >
                <img src={SellBtn} />
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

export default SellModal;
