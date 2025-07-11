import React, { useState } from 'react';
import UserGuide from '../assets/Documents/User-Guide.pdf';
import LegalDisclaimer from '../assets/Documents/Legal-Disclaimer.pdf';
import Instructions from '../assets/Documents/Instructions.pdf';

const pdfFiles = [
  {
    name: 'User Guide',
    url: UserGuide,
  },
  {
    name: 'Legal Disclaimer',
    url: LegalDisclaimer,
  },
  {
    name: 'Instructions',
    url: Instructions,
  },
];

const FloatingHelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[999] text-right">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center bg-[#357bb5] text-white rounded-full p-[20px] w-[50px] h-[50px] text-2xl shadow-lg hover:bg-[#2563eb] transition"
        >
          ?
        </button>
      )}

      {open && (
        <div className="relative bg-white shadow-xl rounded-lg mt-3 p-[10px] max-w-[150px] border border-gray-200 space-y-4">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-0 text-gray-500 hover:text-red-500 hover:border-none text-lg font-bold bg-transparent "
          >
            ×
          </button>

          {pdfFiles.map((pdf, index) => (
            <div key={index} className="text-left mt-1">
              <p className="font-medium text-gray-800 text-sm">{pdf.name}</p>
              <div className="flex gap-4 text-sm mt-1">
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6f96b6] font-semibold text-sm no-underline hover:underline"
                >
                  View
                </a>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingHelpButton;
