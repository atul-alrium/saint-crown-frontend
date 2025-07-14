import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "./walletContext";

const PAYPAL_CLIENT_ID =
  "AZ4DDiSwxwMppZpjA3eSIyntaK6AVkZknXt-1aBDJ8PUydtCx4AbiRXG9lxOhYM0B8chskAb4BVEvKAB";

const PayPalConnection = () => {
  // PayPal state
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("--");
  const [clientId, setClientId] = useState("••••••••••••");
  const [lastSync, setLastSync] = useState("--");

  // MetaMask state
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [isFirefox, setIsFirefox] = useState(false);
  const {
  walletConnected,
  setWalletConnected,
  walletAddress,
  setWalletAddress,
  walletBalance,
  setWalletBalance,
  walletChainId,
  setWalletChainId,
  walletNetwork,
  setWalletNetwork,
  setAfd1Balance,
} = useWallet();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsFirefox(ua.includes("firefox"));
  }, []);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      setHasMetaMask(true);
    } else {
      setHasMetaMask(false);
      detectBrowserAndSetDownloadLink();
    }
  }, []);

  const detectBrowserAndSetDownloadLink = () => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("firefox")) {
      // Firefox
      setDownloadLink(
        "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
      );
    } else if (ua.includes("opr") || ua.includes("opera")) {
      // Opera
      setDownloadLink(
        "https://addons.opera.com/en-gb/extensions/details/metamask-10/?utm_source=www.google.com"
      );
    } else if (ua.includes("edg")) {
      // Edge
      setDownloadLink(
        "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US&utm_source=www.google.com"
      );
    } else if (ua.includes("chrome") || ua.includes("crios")) {
      // Chrome & Brave
      setDownloadLink("https://chrome.google.com/webstore/detail/metamask/");
    } else {
      // All other browsers (e.g., Safari, unknown)
      setDownloadLink("https://metamask.io/download");
    }
  };

  const handlePayPalConnect = () => {
    const maskedId = "••••••••••••" + PAYPAL_CLIENT_ID.slice(-4);
    setName("Atul Reny");
    setClientId(maskedId);
    setLastSync(new Date().toLocaleString());
    setConnected(true);
  };

  const handlePayPalRefresh = () => {
    setLastSync("Just Now");
  };

  const handlePayPalDisconnect = () => {
    setConnected(false);
    setName("--");
    setClientId("••••••••••••");
    setLastSync("--");
  };

  const connectWallet = async () => {
    if (walletConnected) {
      disconnectWallet();
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      console.log("Connected Network:", network);

      // ✅ Block if not Ethereum Mainnet (chainId = 1)
      if (network.chainId !== 1n) {
        alert("Please switch to Ethereum Mainnet to use the wallet.");
        return;
      }

      // ✅ AFD1 Token Info
      const AFD1_TOKEN_ADDRESS = "0x708f9b38a3eaf316d8Fd4ae90b06817783Ed05Dd";
      const ERC20_ABI = [
        "function balanceOf(address) view returns (uint)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
      ];

      const tokenContract = new ethers.Contract(
        AFD1_TOKEN_ADDRESS,
        ERC20_ABI,
        provider
      );

      // ✅ Try fetching AFD1 token data
      let tokenBalanceRaw, decimals, symbol;
      try {
        tokenBalanceRaw = await tokenContract.balanceOf(account);
        decimals = await tokenContract.decimals();
        symbol = await tokenContract.symbol();
      } catch (tokenError) {
        alert(
          "AFD1 token not found in your wallet. Please import it manually."
        );
        return;
      }

      const tokenBalance = Number(
        ethers.formatUnits(tokenBalanceRaw, decimals)
      ).toFixed(4);

      // ✅ Set wallet UI state
      setWalletAddress(account.slice(0, 6) + "..." + account.slice(-4));
      setWalletChainId(network.chainId);
      setWalletNetwork(network.name);
      setWalletConnected(true);
      setWalletBalance(`${tokenBalance} ${symbol}`);
      setAfd1Balance(Number(tokenBalance));
      console.log(tokenBalance);
      
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("-");
    setWalletBalance("-");
    setWalletChainId("-");
    setWalletNetwork("-");
    setWalletConnected(false);
  };

  return (
    <div>
      {/* MetaMask Section */}
      <div className="wallet-card mt-6">
        <div className="wallet-header">
          <div className="wallet-heading">
            <img
              src="https://images.ctfassets.net/clixtyxoaeas/1ezuBGezqfIeifWdVtwU4c/d970d4cdf13b163efddddd5709164d2e/MetaMask-icon-Fox.svg"
              className="wallet-logo"
              alt="MetaMask"
            />
            <div>
              <h2 className="wallet-title">MetaMask Wallet</h2>
            </div>
          </div>
          <div className="wallet-status">
            <span
              className={`status-dot ${walletConnected ? "active" : ""}`}
            ></span>
            <span className="status-text">
              {walletConnected
                ? `Connected to: ${walletNetwork}`
                : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="wallet-body">
          <div className="wallet-grid">
            <div className="wallet-item wallet-addr">
              <span className="item-label">📬 Wallet Address</span>
              <span className="item-value">{walletAddress}</span>
            </div>
            <div className="wallet-item">
              <span className="item-label">💰 Balance</span>
              <span className="item-value">{walletBalance}</span>
            </div>
            <div className="wallet-item">
              <span className="item-label">🆔 Chain ID</span>
              <span className="item-value">{walletChainId}</span>
            </div>
            <div className="wallet-item">
              <span className="item-label">🌐 Network</span>
              <span className="item-value">{walletNetwork}</span>
            </div>
          </div>

          <div
            className="flex justify-between items-center mt-1 md:mt-4"
            id="subtitle-container"
          >
            {hasMetaMask ? (
              <div className="wallet-actions">
                <button
                  className="connect-button"
                  onClick={connectWallet}
                  style={{
                    backgroundColor: walletConnected ? "red" : "",
                    color: "white",
                  }}
                >
                  {walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
                </button>
              </div>
            ) : (
              <div id="noMetamask" className="metamask-warning">
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="download-button">
                    ⬇️ Download MetaMask
                  </button>
                </a>
                <p className="warning-text">
                  The MetaMask Extension is not installed on your browser.
                </p>
              </div>
            )}

            {!isFirefox && (
              <p className="wallet-subtitle">
                Use Firefox for the smoothest MetaMask experience!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PayPal Section */}
      <div className="wallet-card mt-6">
        <div className="wallet-header">
          <div className="wallet-heading">
            <img
              src="https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_640.png"
              className="rounded-full size-14"
              alt="PayPal"
            />
            <div>
              <h2 className="wallet-title">PayPal Banking Network</h2>
            </div>
          </div>
          <div className="wallet-status">
            <span className={`status-dot ${connected ? "active" : ""}`}></span>
            <span className="status-text">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="wallet-body">
          <div className="wallet-grid">
            <div className="wallet-item">
              <span className="item-label">🏦 Name</span>
              <span className="item-value">{name}</span>
            </div>
            <div className="wallet-item">
              <span className="item-label">🧾 Client ID</span>
              <span className="item-value">{clientId}</span>
            </div>
            <div className="wallet-item">
              <span className="item-label">⏱ Last Sync</span>
              <span className="item-value">{lastSync}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              className="integration-btn"
              style={{
                backgroundColor: connected ? "red" : "#0070ba",
                color: "white",
              }}
              // onClick={connected ? handlePayPalDisconnect : handlePayPalConnect}
            >
              {connected ? "Disconnect" : "Connect"}
            </button>
            <button className="integration-btn" onClick={handlePayPalRefresh}>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalConnection;
