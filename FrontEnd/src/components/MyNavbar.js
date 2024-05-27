// Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import {Nav, Navbar} from 'react-bootstrap'
import './styling/MyNavbar.css'

const MyNavbar = ({ isAuthenticated}) => {
    return (
        <Navbar bg="dark" variant="dark" className='my-navbar'>
          {/* <Navbar.Brand as={Link} to="/">Movie</Navbar.Brand> */}
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/login">{isAuthenticated ? 'Logout' : 'Login/SignUp'}</Nav.Link>
          </Nav>
        </Navbar>
      );
    };

export default MyNavbar;