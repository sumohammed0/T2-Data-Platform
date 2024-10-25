// Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container flex items-center justify-between p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        <h1 className="text-2xl font-bold">Data Ingestion App</h1>
        <ul className="flex space-x-4 mt-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
                  : "border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
                  : "border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
              }
            >
              Upload CSV
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/databases"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
                  : "border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
              }
            >
              Manage Databases
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/phone-specs"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
                  : "border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
              }
            >
              Phone Specs
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
