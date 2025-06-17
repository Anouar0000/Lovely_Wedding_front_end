import React from 'react';
import { pdf } from '@react-pdf/renderer';
import TestDocument from '../components/pdf/PdfInvitationDocument';

const TestPDFDownload = () => {
  const handleDownload = async () => {
    const blob = await pdf(<TestDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'test-document.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">PDF Download Test</h1>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default TestPDFDownload;
