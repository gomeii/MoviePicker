import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';


const CarouselCard = ({ movie }) => {
  const [additionalInfo, setAdditionalInfo] = useState({});

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=36043e2&i=${movie.imdbID}`);
        const data = await response.json();
        setAdditionalInfo(data);
      } catch (error) {
        console.error('Error fetching additional info:', error);
      }
    };

    fetchAdditionalInfo();
  }, [movie.imdbID]);

  const posterSrc = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAZlBMVEX///8aGhoAAAATExMNDQ0+Pj6Hh4dPT09YWFhgYGAYGBgWFhYQEBDn5+cGBga3t7fMzMwuLi7X19dubm729vZpaWmxsbHf3983Nzfw8PCPj4+cnJx3d3eioqLDw8OqqqpISEgiIiJlQvb5AAAELUlEQVRoge2Y29qqIBCGdTQzt2lucpOb+7/JBYMpIBraf7SevsPIFxiGjwHD+Omnn346oKwq46a9APh5kf0dNkzj+nFNgCiyPNO3wXp9T63uRZ0nPlID31zkg3seWt57J79QKNg+T511hh52veMmJlItBdMKoihg9FofWnaN44441kA1Vj/Atqfbti5gtxB+pGYpSYHhaTOqAmrZrEfXeXVlhd+kI6WDs0/uHjAtlreiekFE25Ihr4tOGmQG5P/Wcw9dXsBeQ32LUeHa1nEaqjO6ATr0apsdQyAtFgbAfF5bEoD9bVIi/L7Z3oE3j5WF9ZI7/b3cGc6iCuH9djOuHsWOCQnrXQs662ntJaMDmE43EtZD1EkuCamdbzTieu9F7YPaiIQz2WiMMWjFWbbR4/cbjTXQnhUpURa1o6HcpguWP5jaVypPK7itJ4S+qiGWxfYksjHGWILLxpbdQOmAOvJhWV4My1MMS5bAWTRm3mwHvWL/XmHaU4fF5gvvMN8RXvJs7I/squRyWAlbA5jiHiK84+EJ7R9cYd11lQ6U9/ZJ3ETAH7M4F/t6Bk31RIufNuXFkuy+xrmc8gKqFD+f3OZGdkHAjzOXfzgoOvS327SkJ4/fv7Q3e72ttEWt7D24l2wOfwnv5BCv4Omr6Q6UbTw8lXNRgpdYEo2doSseXkWe6LkivARqe6YF2nQebpi+mIsifLAnP/J1IyPAaaLzMRbg4WxhEMsUHfiDmK512YDHC1y3JBTgtK7xx2XSfwovpFz807Aw0108UFzQa8TYlqlY0LDrytWPArySzn8RHvpTKq6Lj/SJBarcIMANNN0lotImCgclYi4xLbmYE+GYi48tONlHfa+ome7zGS7tLxFOPZbLRT3jCpf6wAfh0BLhjuiLWvDM5C5KvnDAi3BWAMzJoAV/uwJTwJdsIlzKRR34TSpsomELzm4H8x7RgLerookrs0R4RW9Z0OjDX4qCbPFVEY6FSjTnogwPa3do+VzslMXenO4SfAj4XJTgBalkyb12mXYK65sfn+4SXLwdiPB+Qs1X/HCrAPamnJDgNIaeHargSwimsWdJoGbTwypUwGOhGOXhdy4EbMmGaItNvsJSXIKLBQAHL4UQUHPLdyt3GNbwDOHNCh5KjyFQNB9uBfBYwdF05zDP8MqUwwsfbxxkdjKc8mYDmOGJ/Qmlose5BEfr8qbD5g3fW7odRaMpwjN8EvLBbercpf8gcNmbDkkowQtGIjvRxjgHufPVhU6s7+UUs87FRA03HuevtZ/hRm+x01z9evgl3Mh6VkQkf0C3VS+ZVTW9iX2pzddA9VlwEL5VWGbfR92DzZtC/fXQ995IR9XL8AFZ1s4Vp4Sv6FJ5Jyu1v4gMRB+e+rKWnPnqQ35/0MSdHp9fPcPG1XxC4xW5zennjp9++um/0T9MYzta2dOhXQAAAABJRU5ErkJggg==';

  return (
    <Card className="movie-card">
      <Card.Img variant="top" src={posterSrc} className="card-img-top" alt={movie.Title} />
      <Card.Body className="card-body">
        <Card.Title className="card-title">{movie.Title}</Card.Title>
        <Card.Subtitle>{movie.Year}</Card.Subtitle>
        <Card.Text className="card-text">
          {additionalInfo.Plot || 'No plot available'}
        </Card.Text>
        <Button href={`https://www.imdb.com/title/${movie.imdbID}`} className="btn btn-primary mt-2">View Details</Button>
      </Card.Body>
    </Card>
  );
};

export default CarouselCard;