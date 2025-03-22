import React, { useEffect, useState, useContext} from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart ,FaRegHeart, FaTimes} from 'react-icons/fa';
import './styling/CarouselCard.css'
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

// movie prop = movie object containing the info of each movie
// onMovieSave prop = calls the "fetchSavedMovies" function on the home page to reload new saved movies
// onMovieRemoved prop = calls the "fetchSavedMovies" function on the home page to reload new saved movies 
// showSaveButton prop = boolean value
const CarouselCard = ({ movie, onMovieSaved, onMovieRemoved, showSaveButton}) => {
  

 
  // Stateful Data [Movie Data (In Depth), Authentication Status (LoggedIn/NotLoggedIn)]
  const [additionalInfo,setAdditionalInfo] = useState({}) 
  const { isAuthenticated } = useContext(AuthContext);

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            credentials: "include", // Send HTTP-only cookie
        });

        if (!response.ok) throw new Error("Failed to refresh token");

        const data = await response.json();
        sessionStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error("Session expired. Please log in again.");
        return null;
    }
  };

  //API Request wrapper with automatic token refresh
  const ModifyMovieWithAuth = async (url, movieInfo, httpMethod, options = {}) => {
    // Pull out token from sessionStorage
    let token = sessionStorage.getItem("accessToken");
    let response = await fetch(`${API_URL}${url}`,{ 
        method: httpMethod,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieInfo)
      }
    );
    
    if (response.status === 401) {
        console.log("Access token expired, attempting refresh...");
        // Try refreshing the token
        const newToken = await refreshAccessToken();
        if (!newToken) {
            // If no new access token received sign user out
            logout();
            return Promise.reject("Session expired. Please log in again.");
        }
        // Retry the original request with the new token
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${API_URL}${url}`, { ...options, headers, credentials: "include" });
    }
    return response.json();
  };

  //  Save Movie Button Logic
  const handleSaveMovie = async (additionalInfo) => {
    try{
      const data = await ModifyMovieWithAuth("/api/users/addMovie", additionalInfo, "POST");
      onMovieSaved();
    } catch (error) {
      console.error('Error on saving movie:', error);
    }
  };

  // Remove Movie Button Logic
  const handleRemoveMovie = async (additionalInfo) => {
      // Try fetching data for logged in user
      try{
        const data = await ModifyMovieWithAuth("/api/users/removeMovie", additionalInfo, "DELETE");
        onMovieRemoved();
      } catch (error) {
        console.error('Error removing movie:', error);
      }
    
  };

  // Side Effect triggered on changes of the movie object (Basic string search query yields less data about each movie so we search for additionalInfo utilizing the imdbID)
  useEffect(() => {
    const fetchAdditionalInfo = async () => { 
      try {
        const response = await fetch(`${API_URL}/api/search/additional`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({movie})
        });
        const data = await response.json();
        setAdditionalInfo(data.movies);
      } catch (error) {
        console.error('Error fetching additional info:', error);
      }
    };

    fetchAdditionalInfo();
  }, [movie]);

  // If no movie available use image placeholder image
  const posterSrc = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAZlBMVEX///8aGhoAAAATExMNDQ0+Pj6Hh4dPT09YWFhgYGAYGBgWFhYQEBDn5+cGBga3t7fMzMwuLi7X19dubm729vZpaWmxsbHf3983Nzfw8PCPj4+cnJx3d3eioqLDw8OqqqpISEgiIiJlQvb5AAAELUlEQVRoge2Y29qqIBCGdTQzt2lucpOb+7/JBYMpIBraf7SevsPIFxiGjwHD+Omnn346oKwq46a9APh5kf0dNkzj+nFNgCiyPNO3wXp9T63uRZ0nPlID31zkg3seWt57J79QKNg+T511hh52veMmJlItBdMKoihg9FofWnaN44441kA1Vj/Atqfbti5gtxB+pGYpSYHhaTOqAmrZrEfXeXVlhd+kI6WDs0/uHjAtlreiekFE25Ihr4tOGmQG5P/Wcw9dXsBeQ32LUeHa1nEaqjO6ATr0apsdQyAtFgbAfF5bEoD9bVIi/L7Z3oE3j5WF9ZI7/b3cGc6iCuH9djOuHsWOCQnrXQs662ntJaMDmE43EtZD1EkuCamdbzTieu9F7YPaiIQz2WiMMWjFWbbR4/cbjTXQnhUpURa1o6HcpguWP5jaVypPK7itJ4S+qiGWxfYksjHGWILLxpbdQOmAOvJhWV4My1MMS5bAWTRm3mwHvWL/XmHaU4fF5gvvMN8RXvJs7I/squRyWAlbA5jiHiK84+EJ7R9cYd11lQ6U9/ZJ3ETAH7M4F/t6Bk31RIufNuXFkuy+xrmc8gKqFD+f3OZGdkHAjzOXfzgoOvS327SkJ4/fv7Q3e72ttEWt7D24l2wOfwnv5BCv4Omr6Q6UbTw8lXNRgpdYEo2doSseXkWe6LkivARqe6YF2nQebpi+mIsifLAnP/J1IyPAaaLzMRbg4WxhEMsUHfiDmK512YDHC1y3JBTgtK7xx2XSfwovpFz807Aw0108UFzQa8TYlqlY0LDrytWPArySzn8RHvpTKq6Lj/SJBarcIMANNN0lotImCgclYi4xLbmYE+GYi48tONlHfa+ome7zGS7tLxFOPZbLRT3jCpf6wAfh0BLhjuiLWvDM5C5KvnDAi3BWAMzJoAV/uwJTwJdsIlzKRR34TSpsomELzm4H8x7RgLerookrs0R4RW9Z0OjDX4qCbPFVEY6FSjTnogwPa3do+VzslMXenO4SfAj4XJTgBalkyb12mXYK65sfn+4SXLwdiPB+Qs1X/HCrAPamnJDgNIaeHargSwimsWdJoGbTwypUwGOhGOXhdy4EbMmGaItNvsJSXIKLBQAHL4UQUHPLdyt3GNbwDOHNCh5KjyFQNB9uBfBYwdF05zDP8MqUwwsfbxxkdjKc8mYDmOGJ/Qmlose5BEfr8qbD5g3fW7odRaMpwjN8EvLBbercpf8gcNmbDkkowQtGIjvRxjgHufPVhU6s7+UUs87FRA03HuevtZ/hRm+x01z9evgl3Mh6VkQkf0C3VS+ZVTW9iX2pzddA9VlwEL5VWGbfR92DzZtC/fXQ995IR9XL8AFZ1s4Vp4Sv6FJ5Jyu1v4gMRB+e+rKWnPnqQ35/0MSdHp9fPcPG1XxC4xW5zennjp9++um/0T9MYzta2dOhXQAAAABJRU5ErkJggg==';
  
  return ( 
    
    <Card className='movie-card'>
      <Card.Img variant="top" src={posterSrc} className="card-img-top" alt={movie.Title} />
      <Card.Body className="card-body">
        <Card.Title className="card-title">{movie.Title}</Card.Title>
        <Card.Subtitle>{movie.Year}</Card.Subtitle>
          <Card.Text className="card-text">
            {additionalInfo.Plot || 'No plot available'}
          </Card.Text>
        <div className="button-container">
          <Button
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            className="btn"
            variant="secondary" 
          >
            View Details
          </Button>
          {isAuthenticated ? (
            showSaveButton ? (
              <Button
                variant="primary"
                onClick={() => handleSaveMovie(additionalInfo)}
              >
              <FaHeart />
              </Button>
            ) : (
              <Button
              variant="danger"
              onClick={() => handleRemoveMovie(additionalInfo)}
              >
              <FaTimes />
              </Button>
            )
          ) : (
            <Button variant="primary" disabled>
              <FaRegHeart/> Login to Save
            </Button>
          )
        }
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarouselCard;