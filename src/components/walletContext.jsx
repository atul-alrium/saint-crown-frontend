import React, { createContext, useState, useContext } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("-");
  const [walletChainId, setWalletChainId] = useState("-");
  const [walletNetwork, setWalletNetwork] = useState("-");
  const [walletBalance, setWalletBalance]=useState("-");

  const [afd1Balance, setAfd1Balance] = useState("0"); // number
  const [walletBalanceFormatted, setWalletBalanceFormatted] = useState("-"); // string for UI

  return (
    <WalletContext.Provider
      value={{
        // wallet connection info
        walletConnected,
        setWalletConnected,
        walletAddress,
        setWalletAddress,
        walletChainId,
        setWalletChainId,
        walletNetwork,
        setWalletNetwork,
        walletBalance,
        setWalletBalance, 
        // AFD1 balance and display
        afd1Balance,
        setAfd1Balance,
        walletBalanceFormatted,
        setWalletBalanceFormatted,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for access
export const useWallet = () => useContext(WalletContext);
