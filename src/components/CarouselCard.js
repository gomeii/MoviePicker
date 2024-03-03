

const CarouselCard = (movie) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};

export default CarouselCard;


// return (
//   <div>
//   <Card style={{ width: '18rem' }}>
//     <Card.Img variant="top" src={movie.movie.Poster} className="card-img-top" alt={movie.movie.Title} />
//     <Card.Body className="card-body">
//       <Card.Title>{movie.movie.Title}</Card.Title>
//       <Card.Subtitle>{movie.movie.Year}</Card.Subtitle>
//       <Card.Text>placeholder</Card.Text>
//       <Button href={`https://www.imdb.com/title/${movie.movie.imdbID}`} className="btn btn-primary">View Details</Button>
//     </Card.Body>
//   </Card>
//   </div>
// );