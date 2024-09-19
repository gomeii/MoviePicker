// import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MyNavbar from './components/MyNavbar';
import LoadingScreen from './components/LoadingScreen';
import './App.css'
// import PrivateRoute from './components/PrivateRoute';

const App = () => {
  // const [isBackendReady, setIsBackendReady] = useState(false);

  // useEffect(() => {
  //   const checkBackendHealth = async () => {
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health`,{
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       if (response.status === 200) {
  //         setIsBackendReady(true);
  //       }
  //     } catch (error) {
  //       console.error('Error checking backend health:', error);
  //     }
  //   };
  //   const intervalId = setInterval(checkBackendHealth, 2000); // Check every 2 seconds

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, []);

  return (
    <AuthProvider>
      <Router>
        <MyNavbar />
        <div className='App'>
          <Routes>
            {/* <Route path="/" element={isBackendReady ? <HomePage /> : <LoadingScreen />} /> */}
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;