import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton = () => {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  
    return (
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.name}</span>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="px-4 py-2 text-white bg-red-500 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Login
          </button>
        )}
      </div>
    );
  };
  
  export default AuthenticationButton;