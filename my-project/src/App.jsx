import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import CSVUploader from './components/CSVUploader';
import DatabasePage from './components/DatabasePage';
import DestinationSelector from './components/DestinationSelector';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
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
              </ul>
            </div>
          </nav>

        <main className="flex-grow w-screen p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<CSVUploader />} />
            <Route path="/databases" element={<DatabasePage />} />
          </Routes>
        </main>

        <footer className="bg-gray-200 p-4 text-center w-screen">
          <p>2024 Team 2: Data Ingestion</p>
        </footer>
      </div>
    </Router>
  );
};

// Placeholder components for routes
const Home = () => <h2>Welcome to CSV to Database App</h2>;

export default App;