// AuthContext.js
import React, { createContext, useEffect, useState} from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Validate the token here (e.g., by making an API request)
        setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false);
      }
    }catch (error){
      console.error('Failed to retrieve token from localStorage', error);
    }
  }, []);


  const login = (token) => {
    try {
      console.log("Authenticating user with token:", token)
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error('Failed to set token in Storage', error);
    }
  };

  const logout = () => {
    try {
      const token = localStorage.getItem("token");  
      console.log("Signing out user with token:", token)
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    } catch (error) {
      console.error('Failed to remove token from localStorage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};