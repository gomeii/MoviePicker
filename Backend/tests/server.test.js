// Import dependencies
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../server');
let server; // Variable to store the server instance

beforeAll(() => {
  server = app.listen(5000); // Start the server before running tests
});

afterAll((done) => {
  server.close(done); // Close the server after tests are done
});
afterAll(async () => {
    await mongoose.disconnect(); // Close MongoDB connection after tests
    server.close(); // Close the server
  });

// Test for the search route with an empty query
describe('Search API (Empty Query)', () => {
    it('should return search results with status 200', async () => {
      const res = await request(app)  // Use your Express app instance
        .post('/api/search/query')    // Use the relative URL
        .send({ searchValue: '' })  // Send the JSON body with the query
        .set('Accept', 'application/json');   // Set the header for JSON requests
  
      // Assertions
      expect(res.statusCode).toEqual(200);   // Check if the status is 200
      expect(res.body).toHaveProperty('validResponse');
    });
  });

// Test for the search route to have valid response field
describe('Search API (Invalid Response)', () => {
    it('should return search results with status 200', async () => {
      const res = await request(app)  // Use your Express app instance
        .post('/api/search/query')    // Use the relative URL
        .send({ searchValue: 'test query' })  // Send the JSON body with the query
        .set('Accept', 'application/json');   // Set the header for JSON requests
  
      // Assertions
      expect(res.statusCode).toEqual(200);   // Check if the status is 200
      expect(res.body).toHaveProperty('validResponse');  // Assuming the API returns a validResponse property
    });
  });

// Test for the search route to have valid response field and movies/shows
describe('Search API (Valid Response)', () => {
    it('should return search results with status 200', async () => {
      const res = await request(app)  // Use your Express app instance
        .post('/api/search/query')    // Use the relative URL
        .send({ searchValue: 'Star Wars' })  // Send the JSON body with the query
        .set('Accept', 'application/json');   // Set the header for JSON requests
  
      // Assertions
      expect(res.statusCode).toEqual(200);   // Check if the status is 200
      expect(res.body).toHaveProperty('validResponse');
      expect(res.body).toHaveProperty('movies');
      expect(res.body).toHaveProperty('totalResults');  // Assuming the API returns a validResponse property
    });
  });

// Test for auth routes
describe('Auth API (Login for Account that DNE)', () => {
  it('Should try to log in for an account that does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'John Doe', password: 'john@example123' }); // Example payload
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });
}); 

describe('Auth API (Invalid Login Credentials', () => {
    it('Should try to log in for an account with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'NewUser', password: 'example123' }); // Example payload
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

describe('Auth API (Login for Valid Account)', () => {
    it('Should try to log in for an account with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'USER_TEST', password: 'PASSWORD_TEST' }); // Example payload
      expect(res.statusCode).toEqual(200);
      // TODO: Maybe tweak the response body for a created account (currently returns the MongoDB user document)
      // expect(res.body).toHaveProperty('_id');
    });
}); 

describe('Auth API, Creating an account with missing fields (No Username)', () => {
  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/create')
      .send({ username: '', password: '1234' });
    expect(res.statusCode).toEqual(400);  // Adjust based on validation
  });
});

describe('Auth API, Creating an account with missing fields (No Password)', () => {
    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/create')
        .send({ username: 'NewUser', password: '' });
      expect(res.statusCode).toEqual(400);  // Adjust based on validation
    });
  }); 

describe('Auth API, Creating an account that already exists', () => {
    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/create')
        .send({ username: 'NewUser', password: '1234' });
      expect(res.statusCode).toEqual(400);  // Adjust based on validation
    });
  }); 

// Test for User routes
describe('User API, Adds movie to user profile', () => {
  it('should add movie object to the user document', async () => {
    const res = await request(app)
    .post('/api/users/addMovie')
    .send({
        userID: '670492144e48ae47202db5a2',
        additionalInfo: {
          Title: 'Star Wars: Episode V - The Empire Strikes Back',
          Year: '1980',
          Rated: 'PG',
          Released: '18 Jun 1980',
          Runtime: '124 min',
          Genre: 'Action, Adventure, Fantasy',
          Director: 'Irvin Kershner',
          Writer: 'Leigh Brackett, Lawrence Kasdan, George Lucas',
          Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher',
          Plot: 'After the Empire overpowers the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda. At the same time, Darth Vader and bounty hunter Boba Fett pursue his friends across the galaxy.',
          Language: 'English',
          Country: 'United States, United Kingdom',
          Awards: 'Won 1 Oscar. 27 wins & 20 nominations total',
          Poster: 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
          Ratings: [
            { Source: 'Internet Movie Database', Value: '8.7/10' },
            { Source: 'Rotten Tomatoes', Value: '95%' },
            { Source: 'Metacritic', Value: '82/100' }
                  ],
          Metascore: '82',
          imdbRating: '8.7',
          imdbVotes: '1,400,371',
          imdbID: 'tt0080684',
          Type: 'movie',
          DVD: 'N/A',
          BoxOffice: '$292,753,960',
          Production: 'N/A',
          Website: 'N/A',
          Response: 'True'
        }   
    })
    expect(res.statusCode).toEqual(200);
  });
});

describe('User API, Adds movie to user profile that is already there', () => {
  it('should add movie object to the user document', async () => {
    const res = await request(app)
    .post('/api/users/addMovie')
    .send({
        userID: '670492144e48ae47202db5a2',
        additionalInfo: {
          Title: 'Star Wars: Episode V - The Empire Strikes Back',
          Year: '1980',
          Rated: 'PG',
          Released: '18 Jun 1980',
          Runtime: '124 min',
          Genre: 'Action, Adventure, Fantasy',
          Director: 'Irvin Kershner',
          Writer: 'Leigh Brackett, Lawrence Kasdan, George Lucas',
          Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher',
          Plot: 'After the Empire overpowers the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda. At the same time, Darth Vader and bounty hunter Boba Fett pursue his friends across the galaxy.',
          Language: 'English',
          Country: 'United States, United Kingdom',
          Awards: 'Won 1 Oscar. 27 wins & 20 nominations total',
          Poster: 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
          Ratings: [
            { Source: 'Internet Movie Database', Value: '8.7/10' },
            { Source: 'Rotten Tomatoes', Value: '95%' },
            { Source: 'Metacritic', Value: '82/100' }
                  ],
          Metascore: '82',
          imdbRating: '8.7',
          imdbVotes: '1,400,371',
          imdbID: 'tt0080684',
          Type: 'movie',
          DVD: 'N/A',
          BoxOffice: '$292,753,960',
          Production: 'N/A',
          Website: 'N/A',
          Response: 'True'
        }   
    })
    expect(res.statusCode).toEqual(400);
  });
});

describe('User API, Removes movie from user profile', () => {
  it('should remove movie object from the user document', async () => {
    const res = await request(app)
    .delete('/api/users/removeMovie')
    .send({
      userID: '670492144e48ae47202db5a2',
      movieData: {
        Title: 'Star Wars: Episode V - The Empire Strikes Back',
        Year: '1980',
        Rated: 'PG',
        Released: '18 Jun 1980',
        Runtime: '124 min',
        Genre: 'Action, Adventure, Fantasy',
        Director: 'Irvin Kershner',
        Writer: 'Leigh Brackett, Lawrence Kasdan, George Lucas',
        Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher',
        Plot: 'After the Empire overpowers the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda. At the same time, Darth Vader and bounty hunter Boba Fett pursue his friends across the galaxy.',
        Language: 'English',
        Country: 'United States, United Kingdom',
        Awards: 'Won 1 Oscar. 27 wins & 20 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        Ratings: [
          { Source: 'Internet Movie Database', Value: '8.7/10' },
          { Source: 'Rotten Tomatoes', Value: '95%' },
          { Source: 'Metacritic', Value: '82/100' }
                ],
        Metascore: '82',
        imdbRating: '8.7',
        imdbVotes: '1,400,371',
        imdbID: 'tt0080684',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: '$292,753,960',
        Production: 'N/A',
        Website: 'N/A',
        Response: 'True'
      }
    })
    expect(res.statusCode).toEqual(200);
  });
});

// Test for auth routes
// describe('Auth API', () => {
//   it('should authenticate a user', async () => {
//     const res = await request(app)
//       .post('/api/auth/login')
//       .send({ email: 'john@example.com', password: 'password123' }); // Example payload
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty('token');  // Assuming it returns a token on login
//   });
// });