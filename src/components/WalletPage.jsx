import React, { useState } from "react";
import Header from "./header";
import PortfolioBalance from "./portfolio-balance";
import PayPalConnection from "./paypal-network";
import SendModal from "./SendModal";
import BuyModal from "./BuyModal";
import SwapModal from "./SwapModal";
import SellModal from "./SellModal";
import BridgeModal from "./BridgeModal";
import LiveBankDeposits from "./BankDeposits";
import Footer from "./Footer";
import actionsLogo from '../assets/images/actions.png';
import SendIcon from '../assets/images/icons/send.png';
import BuyIcon from '../assets/images/icons/buy.png';
import SwapIcon from '../assets/images/icons/swap.png';
import SellIcon from '../assets/images/icons/sell.png';
import BridgeIcon from '../assets/images/icons/bridge.png';
import FloatingHelpButton from "./RecordsAndDoc";

const WalletPage = () => {
  const [modal, setModal] = useState(null);
  const [bottomMessage, setBottomMessage] = useState(null);

  return (
    <>
    <div className="wallet-container">
      <Header />
      <PortfolioBalance />
      <PayPalConnection />
      <div className="my-4 w-full  bg-white py-4 md:py-2 shadow-lg z-[999999999999999]">
        <div className="flex align-center gap-[20px] px-[1rem] pb-4 md:px-[1.9rem]">
        <img width={40} src={actionsLogo} />
        <h2 className="wallet-title">AFD1 Wallet Transactions</h2>
        </div>
      
        <div className=" modal-btn flex flex-wrap justify-center gap-10 my-2 w-full">
          <button
            id="sendBtn"
            className="flex items-center justify-center gap-[5px] min-w-[140px] bg-[#357bb5] from-teal-500 to-blue-500 text-white font-semibold text-lg px-[20px] py-[8px] rounded-full shadow-md hover:shadow-lg hover:shadow-blue-400/50 transition-all"
            onClick={() => setModal("send")}
          >
            <span className="text-[25px] modal-icon"><img width={28} src={SendIcon}/></span>{" "}
            <span className="modal-text">Send</span>
          </button>
          <button
            onClick={() => setModal("buy")}
            className="flex items-center justify-center gap-[5px] min-w-[140px] bg-[#357bb5] from-teal-500 to-blue-500 text-white font-semibold text-lg px-[20px] py-[8px] rounded-full shadow-md hover:shadow-lg hover:shadow-blue-400/50 transition-all"
          >
            <span className="text-[25px] modal-icon"><img width={28} src={BuyIcon}/></span>{" "}
            <span className="modal-text">Buy</span>
          </button>
          <button
            onClick={() => setModal("swap")}
            className="flex items-center justify-center gap-[5px] min-w-[140px] bg-[#357bb5] text-white font-semibold text-lg px-[20px] py-[8px] rounded-full shadow-md hover:shadow-lg hover:shadow-blue-400/50 transition-all"
          >
            <span className="text-[25px] modal-icon"><img width={28} src={SwapIcon}/></span>
            <span className="modal-text"> Swap </span>
          </button>

          <button
            onClick={() => setModal("sell")}
            className="flex items-center justify-center gap-[5px] min-w-[140px] bg-[#357bb5] text-white font-semibold text-lg px-[20px] py-[8px] rounded-full shadow-md hover:shadow-lg hover:shadow-blue-400/50 transition-all"
          >
            <span className="text-[25px] modal-icon"><img width={28} src={SellIcon}/></span>{" "}
            <span className="modal-text">Sell</span>
          </button>

          <button
            onClick={() => setModal("bridge")}
            className="flex items-center justify-center gap-[5px] min-w-[140px] bg-[#357bb5] text-white font-semibold text-lg px-[20px] py-[8px] rounded-full shadow-md hover:shadow-lg hover:shadow-blue-400/50 transition-all"
          >
            <span className="text-[25px] modal-icon"><img width={28} src={BridgeIcon}/></span>{" "}
            <span className="modal-text">Bridge</span>
          </button>
        </div>

        <SendModal visible={modal === "send"} onClose={() => setModal(null)} />
        <BuyModal visible={modal === "buy"} onClose={() => setModal(null)} />
        <SwapModal visible={modal === "swap"} onClose={() => setModal(null)} />
        <SellModal visible={modal === "sell"} onClose={() => setModal(null)} />
        <BridgeModal
          visible={modal === "bridge"}
          onClose={() => setModal(null)}
        />
      </div>
      {/* <LiveBankDeposits /> */}
      
    </div>
    <Footer />
    <FloatingHelpButton />

    </>

  );
};

export default WalletPage;
