// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL;

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  
  // Empty Side Effect that will Only Run on the Initial Render of the AuthProvider function
  useEffect( () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        // Validate the token here (e.g., by making an API request)
        setIsAuthenticated(true);
        setUser(user);
      }else{
        setIsAuthenticated(false);
        setUser(null);
      }
  }, []);

  // Login Function
  const login = async (username, password) => {
    try {
      console.log("Trying to log in with username:", username);
      console.log("Trying to log in with password:", password);
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,password}),
      });
      // JSON Response from backend
      const userData = await response.json();
      const userDataObject = JSON.parse(userData);
      // If response is ok means that the user has logged in successfully
      if (response.ok) {
        // Set stateful data 
        setIsAuthenticated(true);
        setUser(userDataObject);
        setError(null);
        // Store the User ID and User Data in localStorage
        localStorage.setItem('token', userDataObject._id); // Optional: Store token in local storage
        localStorage.setItem('user', JSON.stringify(userDataObject));
      } else {
        // If response is not ok means that the backend has rejected the login request

        // Set Stateful Data for Error Modal
        setError(userData.message || 'An error occurred during login.');
        // Log to Console that an error has occured with the Login Request
        console.error('Login failed:', userData.message);
      }
      // Error Catch (Try-Catch Block)
    } catch (error) {
      // Error Caught somewhere else in the request-response attempt
      setError(error || 'An error occurred during login.');
      console.error('Error during login:', error);
    }
  };

  // Creeate User Logic
  const createUser = async (username,password) => {
    // Receive Username and Password data from the Sign Up form
    const userData = {username, password}
    try {    
      const response = await fetch(`${apiUrl}/api/auth/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      // If response status == 201 Means that the newUser object was created and added to the database  
      if (response.status == 201) {
        console.log(res.body)
        const newUser = res.body.JSON.parse()
        console.log(newUser)
        // Set Stateful Data
        setIsAuthenticated(true);
        setUser(userData);
        setError(null);
        localStorage.setItem('token', userData._id); // Optional: Store token in local storage
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setError(true);
        console.error('Login failed:', userData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(true);
    }
  }

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchUser = () => {
    
  }

  const clearError = () => setError(null);



  return (
    <AuthContext.Provider value={{ isAuthenticated, user, error, clearError, login, createUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};