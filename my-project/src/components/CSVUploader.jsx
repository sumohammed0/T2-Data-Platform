import React, { useState, useEffect } from 'react';
import DestinationSelector from './DestinationSelector';

const CSVUploader = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [databaseOptions, setDatabaseOptions] = useState([]);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      const response = await fetch('http://localhost:8000/databases');
      if (response.ok) {
        const databases = await response.json();
        const options = databases.map(db => ({ label: db.name, value: db.id }));
        setDatabaseOptions(options);
      } else {
        console.error('Failed to fetch databases');
      }
    } catch (error) {
      console.error('Error fetching databases:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDatabaseSelect = (db) => {
    setSelectedDatabase(db);
    // For now, just simulate fetching corresponding table options
    const tables = db
      ? [
          { label: `${db.label}_table1`, value: `${db.value}_table1` },
          { label: `${db.label}_table2`, value: `${db.value}_table2` },
        ]
      : [];
    setTableOptions(tables);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleUpload = async () => {
    if (!file || !selectedDatabase || !selectedTable) {
      alert('Please select a file, database, and table before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('database_id', selectedDatabase.value);
    formData.append('table_name', selectedTable.value);

    try {
      const response = await fetch('http://localhost:8000/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        alert('File uploaded successfully!');
      } else {
        alert('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="p-5">
      <h1 className="mb-4 text-2xl font-bold">CSV Uploader</h1>
      
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8 text-gray-500 dark:text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
          Upload CSV File
        </h2>
        <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
          Upload or drag & drop your CSV data file.
        </p>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
      </label>

      {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}

      {/* Database Dropdown */}
      <DestinationSelector
        title="Select Destination Database:"
        defaultOptions={databaseOptions}
        onSelect={handleDatabaseSelect}
      />

      {/* Table Dropdown */}
      <DestinationSelector
        title={`Select Table from ${selectedDatabase?.label || 'Database'}:`}
        defaultOptions={tableOptions}
        onSelect={handleTableSelect}
      />

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload File to Database
      </button>

      {data.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Uploaded Data Preview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(data[0]).map((header) => (
                    <th key={header} className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 text-sm text-gray-800 border-t border-gray-300">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;