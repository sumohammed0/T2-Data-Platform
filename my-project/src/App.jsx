import React from 'react';
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import CSVUploader from './components/CSVUploader';
import DatabasePage from './components/DatabasePage';
import PhoneSpecsApp from './components/PhoneSpecsApp';

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
          <Navbar />  {/* Navbar appears on all pages */}
          <main className="flex-grow w-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<CSVUploader />} />
              <Route path="/databases" element={<DatabasePage />} />
              <Route path="/phone-specs" element={<PhoneSpecsApp />} />
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
