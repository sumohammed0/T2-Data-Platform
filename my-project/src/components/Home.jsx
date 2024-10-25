// Home.jsx
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center h-96 text-center bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
      <h1 className="text-6xl font-bold mb-6">Upload and Ingest Data Easily</h1>
      <p
        className="text-2xl underline cursor-pointer hover:text-indigo-300"
        onClick={() => loginWithRedirect()}
      >
        Log in to get started →
      </p>
    </div>
  );
};

export default Home;
