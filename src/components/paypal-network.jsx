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
  connectWallet1
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

     await connectWallet1(); 
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

        <div className="wallet-body meta-wallet">
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
                <p class="wallet-subtitle">Please log into your MetaMask Extension prior to connecting your wallet.</p>
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
            <div className="block md:flex gap-[20px] items-center">
              <h2 className="wallet-title">PayPal Banking Network</h2> <span class="coming-soon">COMING SOON</span>
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
            <a
              className="integration-btn no-underline"
              style={{
                backgroundColor: connected ? "red" : "#0070ba",
                color: "white",
              }}
              target="_blank"
              href="https://www.paypal.com/us/home"
              // onClick={connected ? handlePayPalDisconnect : handlePayPalConnect}
            >
              {connected ? "Disconnect" : "Connect"}
            </a>
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
