import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BottomMessage from './BottomMessage';
import BuyBtn from '../assets/images/send_actions.png';

const BuyModal = ({ visible, onClose }) => {
  const [walletAddress, setWalletAddress] = useState('-');
  const [amountUSD, setAmountUSD] = useState('');
  const [bottomMessage, setBottomMessage] = useState(null);

  useEffect(() => {
    if (visible && window.ethereum) {
      (async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
        } catch (err) {
          console.error('Wallet fetch error:', err);
          
          setBottomMessage({ message: "Failed to fetch wallet address", type: "error" });
        }
      })();
    }
  }, [visible]);

  const handleBuy = async () => {
    const usd = parseFloat(amountUSD);
    if (!usd || usd < 10) {
      setBottomMessage({ message: "Minimum amount is $10", type: "error" });
      
      return;
    }

    if (!window.ethereum) {

      setBottomMessage({ message: "MetaMask not found", type:"error" });
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const transak = new TransakSDK.default({
      apiKey: "4cad3cd4-a80b-4df9-8caa-2a7653ef2270",
      environment: "STAGING",
      fiatCurrency: "USD",
      fiatAmount: usd.toString(),
      cryptoCurrency: "ETH",
      walletAddress: address,
      network: "ethereum",
      disableWalletAddressForm: true,
      themeColor: "000000",
      widgetHeight: "550px",
      widgetWidth: "450px"
    });

    transak.init();

    transak.on(transak.ALL_EVENTS, (data) => {
      console.log("[Transak Event]", data);
    });

    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log("Transak widget closed.");
      transak.close();
    });

    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log("Transaction successful:", orderData);

      setBottomMessage({ message: "Your ETH purchase was successful!", type: "success" });
      transak.close();
    });
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

        <h2 className="text-xl font-bold mb-4 text-left">Buy ETH with Fiat</h2>

        <div className="send-modal-main flex flex-wrap mb-4 flex-col md:flex-row justify-between items-center">
          <div className="w-full pr-0 pb-[15px] md:w-[50%] md:pr-6 md:pb-0 rounded-xl">
            <label className="text-base font-bold text-gray-800 mb-[6px]">Connected Wallet Address</label>
            <p className="text-sm text-green-600 truncate">{walletAddress}</p>
          </div>

          <div className="w-full pr-0 md:w-[45%] md:pr-6 rounded-xl">
            <label className="text-base font-bold text-gray-800">Amount (USD)</label>
            <input
              type="number"
              min="10"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              placeholder="Enter amount in USD"
              className="w-full text-sm p-2 border border-gray-300 rounded text-sm mt-1 bg-white"
            />
          </div>
          <div className='w-[5%] pr-6 rounded-xl'>
          <button
            onClick={handleBuy}
            className="rounded-full w-[45px] mt-[26px] mb-0 p-[4px] max-w-[150px] bg-[#357bb5] hover:bg-[#2563eb] text-white font-semibold"
          >
            <img src={BuyBtn} />
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

export default BuyModal;
