import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'react';
/* import Badge from 'react-bootstrap/Badge'; */

const CarouselCard = (movie) => {
    const [additionalData,setAdditionalData] = useState(null);
/*     console.log(movie.movie.imdbID); */

    useEffect(() => {
        fetch(`http://www.omdbapi.com/?apikey=36043e2&i=${movie.movie.imdbID}`)
          .then(response => response.json())
          .then(data => {
            setAdditionalData(data);
            console.log(data.Plot); 
          })
          .catch(error => {
            console.error('Error fetching additional data:', error);
          });
      }, [movie.movie.imdbID]); // Fetch data when the movie ID changes
      

      return (
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={movie.movie.Poster} className="card-img-top" alt={movie.movie.Title} />
          <Card.Body className="card-body">
            <Card.Title>{movie.movie.Title}</Card.Title>
            <Card.Subtitle>{movie.movie.Year}</Card.Subtitle>
            <Card.Text>placeholder</Card.Text>
            <Button a href={`https://www.imdb.com/title/${movie.movie.imdbID}`} className="btn btn-primary">View Details</Button>
          </Card.Body>
        </Card>
      );
    };

export default CarouselCard;