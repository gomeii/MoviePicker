// import logo from './logo.svg';
import React, {useState, use} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MyNavbar from './components/MyNavbar';
import './App.css'
// import PrivateRoute from './components/PrivateRoute';

const App = () => {

  // const {isAuthenticated, logon, logout} = React.useContext(AuthContext);

  return (

    <Router>
      <MyNavbar/>
      <div className='App'>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
