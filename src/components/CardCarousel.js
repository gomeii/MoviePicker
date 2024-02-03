// CardCarousel.js
import Carousel from 'react-bootstrap/Carousel';
import Card from './Card';
import { Badge } from 'react-bootstrap';


const CardCarousel = ({ movies }) => {
  // Fetch movies based on search term
  return (
  <div>
    <h3>Card Carousel</h3>
    <Carousel className="carousel slide" data-bs-ride="carousel">
        {movies.map((movie, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <Card movie={movie} />
            </div>
        ))}
    </Carousel>
  </div>

/*     <div id="movieCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {movies.map((movie, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <img src={movie.Poster} className="d-block w-100" alt={movie.Title} />
            <div className="carousel-caption d-none d-md-block">
              <h5>{movie.Title}</h5>
              <p>{movie.Year}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div> */
  );
};
export default CardCarousel;

