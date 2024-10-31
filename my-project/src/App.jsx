import React from 'react';
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import CSVUploader from './components/CSVUploader';
import DatabasePage from './components/DatabasePage';
import PhoneSpecsApp from './components/PhoneSpecsApp';
import PhoneTable from './components/PhoneTable';

const App = () => {
  const domain = "dev-2ps4vfgtgwb7tb4x.us.auth0.com";
  const clientId = "PKRqCrdNE8iBPgO96ONJ64NZTa5ILiTG";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: "https://dev-2ps4vfgtgwb7tb4x.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin + "/callback",
      }}
    >
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
                <li>
                  <NavLink
                    to="/phones"
                    className={({ isActive }) =>
                      isActive
                        ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
                        : "border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
                    }
                  >
                    All Phones
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
              <Route path="/phone-specs" element={<PhoneSpecsApp />} />
              <Route path="/phones" element={<PhoneTable />} />
            </Routes>
          </main>

          <footer className="bg-gray-200 p-4 text-center w-screen">
            <p>2024 Team 2: Data Ingestion</p>
          </footer>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;
