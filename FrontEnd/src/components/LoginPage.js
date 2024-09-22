// src/components/LoginPage.js

import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
// TODO: Implement functionality to display modal on login error
// import ErrorModal from './ErrorModal';
import './styling/LoginPage.css'

const LoginPage = () => {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // TODO: Implement stateful data to have as dependency on when to show the modal
  // const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // Determine if it's login or create user mode
  const {login, createUser, error, clearError} = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Determine the API endpoint based on the mode
    if (isLoginMode) {
      await login(username, password);
    } else {
      await createUser(username, password);
    }
    
    // If there's no error, navigate to the home page
    if (!error) {
      setUsername('');
      setPassword('');
      navigate('/');
    }else{
      console.log("Invalid Authentication, Try Again");
    }

  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);

    // Clear the form fields when switching modes
    clearError();
    setUsername('');
    setPassword('');
  };


  return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="login-container">
              <Card.Body>
                <Card.Title>
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