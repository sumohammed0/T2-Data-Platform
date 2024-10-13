import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

// Helper function to create an option object
const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

// Default options array
const defaultOptions = [
  createOption('test1.db'),
  createOption('test2.db'),
  createOption('test3.db'),
];

const SelectComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState(null);

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };

  return (
    <div className="max-w-lg p-4 mx-auto">
      <h2 class="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">Select Destination Database Name:</h2>
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={(newValue) => setValue(newValue)}
        onCreateOption={handleCreate}
        options={options}
        value={value}
      />
    </div>
  );
};

export default SelectComponent;
