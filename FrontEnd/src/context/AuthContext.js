// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL;

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  
  // Empty Side Effect that will Only Run on the Initial Render of the AuthProvider function
  useEffect( () => {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        // Validate the token here (e.g., by making an API request)
        setIsAuthenticated(true);
        // setUser(user);
      }else{
        setIsAuthenticated(false);
        // setUser(null) ;
      }
  }, []);

  // Login Function
  const login = async (username, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username,password}),
      });

      // JSON Response from backend
      const data = await response.json();
      // If response is ok means that the user has logged in successfully
      if (response.ok) {
        sessionStorage.setItem("accessToken", data.accessToken)
        // Set stateful data 
        setIsAuthenticated(true);
        setError(null);
      } else {
        // If response is not ok means that the backend has rejected the login request
        // Set Stateful Data for Error Modal
        setIsAuthenticated(false);
        setError(data.message || 'An error occurred during login.');
        // Log to Console that an error has occured with the Login Request
        console.error('Login failed:', data.message);
      }
      // Error Catch (Try-Catch Block) 
    } catch (error) {
      // Error Caught somewhere else in the request-response attempt
      setError(error || 'An error occurred during login()');
      console.error('Error during login:', error);
    }
  };

  // Create User Logic
  const createUser = async (username,password,firstName, lastName) => {
    // Receive Username and Password data from the Sign Up form
    const userData = {username, password,firstName,lastName};
    try {    
      const response = await fetch(`${apiUrl}/api/auth/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      // If response status code is 200-299 means that endpoint responded appropriately 
      if (response.ok) {
        sessionStorage.setItem("accessToken", data.accessToken);
        // Set Stateful Data
        setIsAuthenticated(true);
        setError(null);
      } 
      // If response status is bad != 200-299 status code then set error and console log the error message
      else {
        setIsAuthenticated(false);
        setError(true);
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      setError(error || 'An error occurred during createUser().');
      console.error('Error during user creation:', error);
    }
  }

  // Logout Function
  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    // setUser(null);
  };

  // Clear Error function runs on first render
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, clearError, login, createUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};