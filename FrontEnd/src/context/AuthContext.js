// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);



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
      // console.log("Authenticating user with token:", token)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,password}),
      });
      const userData = await response.json();
      console.log(response);
      if (response.ok) {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', userData._id); // Optional: Store token in local storage
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.error('Login failed:', userData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const createUser = async (username,password) => {
    try {
      // console.log("Authenticating user with token:", token)
      const response = await fetch('http://localhost:5000/api/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,password}),
      });
      const userData = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', userData._id); // Optional: Store token in local storage
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.error('Login failed:', userData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
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



  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};