// import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MyNavbar from './components/MyNavbar';
import './App.css'
// import PrivateRoute from './components/PrivateRoute';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <MyNavbar />
        <div className='App'>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;