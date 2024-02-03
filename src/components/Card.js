import Card from 'react-bootstrap/Card';
/* import Badge from 'react-bootstrap/Badge'; */

const CarouselCard = (movie) => {
    
    const title = movie.movie.Title;
    const img = movie.movie.Poster;
    const type = movie.movie.Type;
    const year = movie.movie.Year;
    const plot = movie.movie.Plot;
/*     console.log(movie.movie.Title); */ 
 /* const rating = movie.Rating */
    
    return(
        <Card>
        <Card.Img variant="top" src={img}></Card.Img>
        <Card.Body>
            <Card.Title>{title}</Card.Title> 
            <Card.Subtitle>{type}</Card.Subtitle>
            <Card.Text>{plot}</Card.Text>
{/*             <Badge bg="primary">{rating}</Badge> */}
        </Card.Body>    
        </Card>
    );
};

export default CarouselCard;