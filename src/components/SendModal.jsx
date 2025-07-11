import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BottomMessage from "./BottomMessage";
import SendBtn from "../assets/images/send_actions.png";

const SendModal = ({ visible, onClose }) => {
  const [ethUsdRate, setEthUsdRate] = useState(0);
  const [walletInfo, setWalletInfo] = useState({
    address: "-",
    network: "-",
    balance: "-",
  });
  const [ethAmount, setEthAmount] = useState("");
  const [usdEstimate, setUsdEstimate] = useState("$0.00");
  const [toAddress, setToAddress] = useState(
    "0x000000000000000000000000000000000000dEaD"
  );
  const [bottomMessage, setBottomMessage] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchRateAndWalletInfo();
    }
  }, [visible]);

  const fetchRateAndWalletInfo = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum"
      );
      const data = await res.json();
      setEthUsdRate(data.ethereum.usd);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);
        const eth = ethers.formatEther(balance);

        setWalletInfo({
          address,
          network: `${network.name} (Chain ID: ${network.chainId})`,
          balance: `${parseFloat(eth).toFixed(4)} ETH`,
        });
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSend = async () => {
    if (!ethers.isAddress(toAddress) || parseFloat(ethAmount) <= 0) {
      setBottomMessage({
        message: "Please enter a valid ETH amount and a valid address.",
        type: "error",
      });
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(ethAmount.toString()),
      });
      setBottomMessage({
        message: `Transaction sent! Hash: ${tx.hash}`,
        type: "success",
      });
      onClose();
    } catch (err) {
      setBottomMessage({ message: "Transaction failed", type: "error" });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setEthAmount(value);
    const est = parseFloat(value || 0) * ethUsdRate;
    setUsdEstimate(`$${est.toFixed(2)}`);
  };

  if (!visible) return null;

  return (
    <>
      <div id="buyModal" className="w-full mt-10">
        <div className="relative rounded-2xl p-6 text-gray-900 shadow-inner  w-[90%] md:w-[73.8%] m-auto bg-[#E2F3F9]">
          <button
            id="closeBuyModal"
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold bg-transparent border-none p-0"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-left">Send ETH</h2>

          {/* Wallet Info */}

          <div className="send-modal-main flex flex-wrap send-modal-first">
            <div className="w-full pr-0 pb-[15px] md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-base font-bold text-gray-800">
                Your Wallet
              </label>
              <p
                id="buyWalletAddress"
                className="text-green-600 text-sm truncate"
              >
                {walletInfo.address}
              </p>
            </div>

            <div className="w-full pr-0 pb-[15px] md:w-[22.5%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-base font-bold text-gray-800">
                Network
              </label>
              <p className="text-sm text-blue-600">{walletInfo.network}</p>
            </div>

            <div className="w-full pr-0 pb-[15px] md:w-[22.5%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-base font-bold text-gray-800">
                Balance
              </label>
              <p className="text-sm text-yellow-600">{walletInfo.balance}</p>
            </div>
            <div className="w-[5%] pr-6 rounded-xl"></div>
          </div>

          {/* Second Row */}
          <div className="send-modal-main flex flex-wrap items-end">
            <div className="w-full pr-0 pb-[15px] md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-base font-bold text-gray-800">
                To Address
              </label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                className="w-full text-sm p-2 rounded bg-gray-100 border border-gray-300"
              />
            </div>

            <div className="w-full pr-0 pb-[15px] md:w-[22.5%] md:pr-6 md:pb-0 rounded-xl">
              <label className="text-base font-bold text-gray-800">
                Amount in ETH
              </label>
              <input
                type="number"
                value={ethAmount}
                onChange={handleAmountChange}
                className="w-full text-sm p-2 rounded bg-gray-100 border border-gray-300"
                placeholder="0.01"
                min="0"
              />
            </div>

            <div className="w-full pr-0 md:w-[22.5%] md:pr-6 rounded-xl">
              <label className="text-base font-bold text-gray-800">
                USD Equivalent
              </label>
              <p className="text-sm text-green-600">{usdEstimate}</p>
            </div>

            <div className="w-[5%] mt-[21px]">
              <button
                onClick={handleSend}
                className="rounded-full w-[45px] h-auto p-[5px] bg-[#357bb5] hover:bg-[#2563eb] text-white font-semibold"
              >
                <img src={SendBtn} alt="Send" />
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

export default SendModal;
