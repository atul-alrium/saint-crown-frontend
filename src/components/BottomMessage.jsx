import React, { useEffect, useState } from 'react';

const BottomMessage = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-md shadow-md w-[90%] max-w-xl flex items-center justify-between z-[9999999]
      ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
    `}>
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="ml-4 font-bold text-xl bg-transparent border-none p-0">&times;</button>
    </div>
  );
};

export default BottomMessage;
