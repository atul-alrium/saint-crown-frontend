import React, { createContext, useState, useContext } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("-");
  const [walletChainId, setWalletChainId] = useState("-");
  const [walletNetwork, setWalletNetwork] = useState("-");
  const [walletBalance, setWalletBalance] = useState("-");
  const [afd1Balance, setAfd1Balance] = useState("0");
  const [walletBalanceFormatted, setWalletBalanceFormatted] = useState("-");

  const AFD1_TOKEN_ADDRESS = "0x708f9b38a3eaf316d8Fd4ae90b06817783Ed05Dd";
  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  const connectWallet1 = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      console.log("Connected Network:", network);

      if (network.chainId !== 1n) {
        alert("Please switch to Ethereum Mainnet to use the wallet.");
        return;
      }

      const tokenContract = new ethers.Contract(
        AFD1_TOKEN_ADDRESS,
        ERC20_ABI,
        provider
      );

      const tokenBalanceRaw = await tokenContract.balanceOf(account);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();

      const tokenBalance = Number(
        ethers.formatUnits(tokenBalanceRaw, decimals)
      ).toFixed(4);

      setWalletAddress(account.slice(0, 6) + "..." + account.slice(-4));
      setWalletChainId(network.chainId);
      setWalletNetwork(network.name);
      setWalletConnected(true);
      setWalletBalance(`${tokenBalance} ${symbol}`);
      setWalletBalanceFormatted(tokenBalance);
      setAfd1Balance(Number(tokenBalance));
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet.");
    }
  };

  return (
    <WalletContext.Provider
      value={{
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
        afd1Balance,
        setAfd1Balance,
        walletBalanceFormatted,
        setWalletBalanceFormatted,
        connectWallet1, // ✅ Exposed globally
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
