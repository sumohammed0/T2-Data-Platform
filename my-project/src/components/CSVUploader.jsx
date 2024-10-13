import React, { useState, useEffect } from 'react';
import DestinationSelector from './DestinationSelector';

const CSVUploader = () => {
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);

  const handleDatabaseSelect = (db) => {
    setSelectedDatabase(db);
    // For now, just simulate fetching corresponding table options
    const tables = db
      ? [
          { label: `${db.value}_table1`, value: `${db.value}_table1` },
          { label: `${db.value}_table2`, value: `${db.value}_table2` },
        ]
      : [];
    setTableOptions(tables);
    console.log('Updated tableOptions:', tables);

  };

  return (
    <div>
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
        <input id="dropzone-file" type="file" className="hidden" />
      </label>

      {/* Database Dropdown */}
      <DestinationSelector
        title="Select Destination Database:"
        defaultOptions={[
          { label: 'test1', value: 'test1' },
          { label: 'test2', value: 'test2' },
          { label: 'test3', value: 'test3' },
        ]}
        onSelect={handleDatabaseSelect}
      />

      {/* Table Dropdown */}
      <DestinationSelector
        title={`Select Table from ${selectedDatabase?.label || 'Database'}:`}
        defaultOptions={tableOptions}
        onSelect={(table) => console.log('Selected table:', table)}
      />
    </div>
  );
};

export default CSVUploader;
