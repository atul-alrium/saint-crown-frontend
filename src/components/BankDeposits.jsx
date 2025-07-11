import React, { useState } from 'react';

const LiveBankDeposits = () => {
  const [bottomMessage, setBottomMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const refreshDeposits = () => {
    setBottomMessage('Deposits refreshed');
    setShowMessage(true);
  };

  const viewAllDeposits = () => {
    setBottomMessage('Viewing all deposits');
    setShowMessage(true);
  };

  const downloadDepositReport = () => {
    setBottomMessage('Downloading report...');
    setShowMessage(true);
  };

  const hideBottomMessage = () => {
    setShowMessage(false);
    setBottomMessage('');
  };

  return (
    <div className="relative">
      <div className="w-full h-full z-10 absolute top-0 left-0 bg-[#57575791]"></div>

      <div className="integration-section">
        <div className="integration-header">
          <h2 className="integration-title">
            Live Bank Deposits <span className="coming-soon">Coming Soon</span>
          </h2>
          <div className="status-indicator">
            <div className="status-dot active"></div>
            <span className="status-text">Active</span>
          </div>
        </div>

        <div className="integration-content">
          <div id="depositsContainer">
            {/* Deposits will be loaded dynamically */}
          </div>

          <div className="integration-actions">
            <button className="integration-btn" onClick={refreshDeposits}>
              Refresh Deposits
            </button>
            <button className="integration-btn" onClick={viewAllDeposits}>
              View All
            </button>
            <button className="integration-btn" onClick={downloadDepositReport}>
              Download Report
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <div
          id="bottomMessageBox"
          className="message-box fixed bottom-5 right-27 transform -translate-x-1/2 z-50 flex items-center bg-white p-4 shadow-lg rounded-md"
        >
          <span id="bottomMessageText">{bottomMessage}</span>
          <button
            id="closeBottomMessage"
            onClick={hideBottomMessage}
            className="ml-4 text-xl font-bold"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveBankDeposits;
