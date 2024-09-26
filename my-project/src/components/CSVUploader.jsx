import React, { useState } from 'react';

const CSVUploader = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        alert('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="p-[20px]">
      <h1 className="mb-[16px] font-bold text-2xl">CSV Uploader</h1>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        className="mb-[16px]"
      />
      <button 
        onClick={handleUpload} 
        className='mb-[16px] p-[8px] bg-cyan-700 text-white'
      >
        Upload CSV
      </button>
      
      {data.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((header) => (
                <th key={header} className="border border-solid border-white p-2 bg-cyan-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} style={{ border: '1px solid #ddd', padding: '8px' }}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CSVUploader;