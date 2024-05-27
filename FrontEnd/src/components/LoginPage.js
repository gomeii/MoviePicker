// src/components/LoginPage.js

import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import { AuthContext } from '../context/AuthContext';

// import axios from 'axios';
import './styling/LoginPage.css'

const LoginPage = () => {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true); // Determine if it's login or create user mode
  const {login} = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const userData = {
      username: username,
      password: password,
    };

    // Determine the API endpoint based on the mode
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/users/create';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User authenticated successfully:', result);
        const token = result._id;
        console.log('Token:', token)
        login(token);
      } else {
        console.error('Error authenticating user:', result.message);
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
    }

    
    // Clear the form fields after submission
    setUsername('');
    setPassword('');
    navigate('/');
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);

    // Clear the form fields when switching modes
    setUsername('');
    setPassword('');
  };


  return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  {isLoginMode ? 'Login' : 'Sign Up'}
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername" className='mb-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword" className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    {isLoginMode ? 'Login' : 'Sign Up'}
                  </Button>
                </Form>
                <Button
                  variant="link"
                  className="w-100 mt-3"
                  onClick={toggleMode}
                >
                  {isLoginMode ? 'Create an account' : 'Already have an account? Login'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default LoginPage;