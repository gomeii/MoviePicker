// import logo from './logo.svg';
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import './App.css'
// import PrivateRoute from './components/PrivateRoute';

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated}/>} />
          <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
