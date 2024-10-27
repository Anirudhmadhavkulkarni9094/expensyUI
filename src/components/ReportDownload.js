import React from 'react';
import api from './axiosConfig';

const ReportDownload = () => {
  const downloadReport = async () => {
    try {
      const response = await api.get('https://expensy-rr68.onrender.com/api/expenses/report', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Failed to download report');
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={downloadReport}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
      >
        Download CSV Report
      </button>
    </div>
  );
};

export default ReportDownload;
