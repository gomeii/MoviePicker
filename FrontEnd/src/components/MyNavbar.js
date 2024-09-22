// Navbar.js

import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import {Nav, Navbar} from 'react-bootstrap'
import './styling/MyNavbar.css'
import {AuthContext} from '../context/AuthContext';

const MyNavbar = () => {

  const { isAuthenticated, logout } = useContext(AuthContext);
  console.log('Navbar render, isAuthenticated:', isAuthenticated); // Debug log
  
    return (
        <Navbar bg="dark" variant="dark" className='my-navbar'>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={isAuthenticated ? logout : null}>
              {isAuthenticated ? 'Logout' : 'Login/SignUp'}
            </Nav.Link>
          </Nav>
        </Navbar>
      );
    };

export default MyNavbar;