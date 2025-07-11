import React, { useEffect, useState } from 'react';
import send from '../assets/images/send.gif';
import receive  from '../assets/images/receive.gif';
import buy  from '../assets/images/buy.gif';
import stack  from '../assets/images/stack.gif';
import Blockchain  from '../assets/images/Blockchain.gif';
import settings  from '../assets/images/settings.gif';


const PortfolioBalance = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [priceChange, setPriceChange] = useState('+0.1%'); // Static for now
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=tether-gold',
          {
            headers: {
              accept: 'application/json',
              'x-cg-demo-api-key': 'CG-ycg12DPVjGwWfR7drnC5RAFg',
            },
          }
        );

        const data = await response.json();
        const liveGoldPrice = data['tether-gold'].usd;

        const calculatedTokenPrice = (liveGoldPrice * 0.1).toFixed(2);
        setGoldPrice(liveGoldPrice.toFixed(2));
        setTokenPrice(calculatedTokenPrice);
      } catch (err) {
        console.error('Failed to fetch gold price:', err);
        setError('Unable to fetch live price.');
      }
    };

    fetchGoldPrice();
  }, []);
  const loadAccountData = () => {
    console.log('Refresh clicked. Implement loadAccountData logic.');
  };

  return (
    <div className="main-grid">
      {/* Balance Section */}
      <div className="balance-section">
        <div className="balance-header">
          <h2 className="balance-title">
            Portfolio Balance <span className="coming-soon">COMING SOON</span>
          </h2>
          <button className="refresh-btn" onClick={loadAccountData}>Refresh</button>
        </div>

        <div className="token-balances">
          <div className="token-card">
            <div className="token-symbol">AFD1 Token</div>
            <div className="token-balance" id="afd1Balance">0</div>
            <div className="token-value" id="afd1ValueUSD">$0.00</div>
          </div>
          <div className="token-card usd-card">
            <div className="token-symbol">Account Balance</div>
            <div className="token-balance" id="usdBalance">0</div>
            <div className="token-value">Connect wallet to view</div>
          </div>
        </div>

        <div className="price-display">
          <div className="price-header">
            <div className="price-title">AFD1 Live Price</div>
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>Live</span>
            </div>
          </div>
          <div className="current-price" id="currentPrice">{error ? 'Error' : tokenPrice ? `$${tokenPrice}` : 'Loading...'}</div>
          <span className="price-change" id="priceChange">{priceChange}</span>
          <div className="gold-basis" id="goldBasis"> {error
          ? error
          : goldPrice
          ? `Live Gold: $${goldPrice}/oz (CoinGecko Tether Gold)`
          : 'Loading live gold price...'}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="actions-title">
          Quick Actions <span className="coming-soon">Coming Soon</span>
        </h3>
        <div className="action-grid">
          <div className="action-btn" onClick={() => console.log('Send')}>
            <div className="action-img">
              <img src={send} alt="Send" />
            </div>
            <div className="action-label">Send</div>
          </div>

          <div className="action-btn" onClick={() => console.log('Receive')}>
            <div className="action-img">
              <img src={receive} alt="Receive" />
            </div>
            <div className="action-label">Receive</div>
          </div>

          <div className="action-btn" onClick={() => console.log('Buy')}>
            <div className="action-img">
              <img src={buy} alt="Buy" />
            </div>
            <div className="action-label">Buy</div>
          </div>

          <div className="action-btn" onClick={() => console.log('Stake')}>
            <div className="action-img">
              <img src={stack} alt="Stake" />
            </div>
            <div className="action-label">Stake</div>
          </div>

          <div className="action-btn" onClick={() => console.log('Blockchain')}>
            <div className="action-img">
              <img src={Blockchain} alt="Blockchain" />
            </div>
            <div className="action-label">Blockchain</div>
          </div>

          <div className="action-btn" onClick={() => console.log('Settings')}>
            <div className="action-img">
              <img src={settings} alt="Settings" />
            </div>
            <div className="action-label">Settings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBalance;
