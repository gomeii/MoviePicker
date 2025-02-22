// Import dependencies
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/user'); // Ensure you have the User model


const {app} = require('../server');
let server; // Variable to store the server instance
let testUser = {
  username: 'TestUser123',
  password: 'SecurePass123!',
  firstName: 'Test',
  lastName: 'User'
}
let exampleMovie = {
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
let exampleMovieInvalid = {
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
  Type: 'movie',
  DVD: 'N/A',
  BoxOffice: '$292,753,960',
  Production: 'N/A',
  Website: 'N/A',
  Response: 'True'
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  server = app.listen(5000); // Start the server before running tests
});


afterAll(async () => {
  // Cleanup: Delete the test user from the database
  await User.deleteOne({ username: testUser.username });

  await mongoose.disconnect();
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
});

// Test for the search route with an empty query
describe('Search API (Empty Query)', () => {
    it('should return no search results with status 500', async () => {
      const res = await request(app)  // Use your Express app instance
        .post('/api/search/query')    // Use the relative URL
        .send({ searchValue: '' })  // Send the JSON body with the query
        .set('Accept', 'application/json');   // Set the header for JSON requests
  
      // Assertions
      expect(res.statusCode).toEqual(500);   // Check if the status is 500
      expect(res.body).toHaveProperty('validResponse');
      expect(res.body).toHaveProperty('error');
      expect(res.body.validResponse).toBe("False");      
      expect(res.body.error).toBe("Incorrect IMDb ID."); // Unsure why the api returns this on an empty query
      
    });
  });

// Test for the search route to have valid response field
describe('Search API (Invalid Response)', () => {
    it('should return search results with status 500', async () => {
      const res = await request(app)  // Use your Express app instance
        .post('/api/search/query')    // Use the relative URL
        .send({ searchValue: 'test query' })  // Send the JSON body with the query
        .set('Accept', 'application/json');   // Set the header for JSON requests
  
      // Assertions
      expect(res.statusCode).toEqual(500);   // Check if the status is 500
      expect(res.body).toHaveProperty('validResponse');
      expect(res.body).toHaveProperty('error')
      expect(res.body.validResponse).toBe("False");
      expect(res.body.error).toBe("Movie not found!");
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
      expect(res.body).toHaveProperty('totalResults');
      expect(res.body.validResponse).toBe("True");
    });
  });

// Test for auth routes
describe('Auth API, Creating an account', () => {
  it('should pass and return a 200 status code', async () => {
    const res = await request(app)
      .post('/api/auth/create')
      .send({ username: testUser.username, password: testUser.password, firstName: testUser.firstName, lastName: testUser.lastName});
    expect(res.statusCode).toEqual(200);  // Adjust based on validation
  });
}); 

describe('Auth API (Login for Account that DNE)', () => {
  it('Should try to log in for an account that does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: "John Doe", password: "john@example123" }); // Example payload
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe("Invalid credentials");
  });
}); 

describe('Auth API (Invalid Login Credentials)', () => {
    it('Should try to log in for an account with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'NewUser', password: 'example123' }); // Example payload
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

describe('Auth API (Login for Valid Account)', () => {
    it('Should try to log in for an account with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password }); // Example payload
      expect(res.statusCode).toEqual(200);
    });
}); 

describe('Auth API, Creating an account with missing fields (No Username)', () => {
  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/create')
      .send({ username: '', password: '1234', firstName: "blankUser", lastName: "blankLast"});
    expect(res.statusCode).toEqual(400);  // Adjust based on validation
  });
}); 

describe('Auth API, Creating an account that already exists', () => {
    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/create')
        .send({ username: testUser.username, password: testUser.password, firstName: testUser.firstName, lastName: testUser.lastName});
      expect(res.statusCode).toEqual(400);  // Adjust based on validation
      expect(res.body).toHaveProperty("message");
    });
  }); 

// Test for User routes
describe('User API, Adds movie to user profile', () => {
  it('should add movie object to the user document and return 200 status code', async () => {
    const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: testUser.username, password: testUser.password})

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('accessToken'); // Ensure token exists
    
    const token = loginRes.body.accessToken;
    if (!token) {
      throw new Error('Login failed, no accessToken returned');
    }

    const addMovieRes = await request(app)
    .post('/api/users/addMovie')
    .set('Authorization', `Bearer ${token}`) // Set the Bearer token
    .set('Credentials', `Include`)
    .send(exampleMovie)
    expect(addMovieRes.statusCode).toEqual(200);
  });
});


describe('User API, Adds movie to user profile (Bad Credentials)', () => {
  it('should fail to add movie object and return 403 status code', async () => {

    const addMovieRes = await request(app)
    .post('/api/users/addMovie')
    .send(exampleMovie)
        expect(addMovieRes.statusCode).toEqual(403);
  });
});

describe('User API, Removes movie from user profile (Bad Credentials)', () => {
  it('should fail to remove movie object from the user document and return 403 status code', async () => {
    const res = await request(app)
    .delete('/api/users/removeMovie')
    .send(exampleMovie)
    expect(res.statusCode).toEqual(403);
  });
});

describe('User API, Removes movie from user profile (Invalid Movie Info)', () => {
  it('should fail to remove movie object from the user document and return 400 status code', async () => {
    const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: testUser.username, password: testUser.password})

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('accessToken'); // Ensure token exists
    
    const token = loginRes.body.accessToken;
    if (!token) {
      throw new Error('Login failed, no accessToken returned');
    }
    
    const res = await request(app)
    .delete('/api/users/removeMovie')
    .set('Authorization', `Bearer ${token}`) // Set the Bearer token
    .set('Credentials', `Include`)
    .send(exampleMovieInvalid)
    expect(res.statusCode).toEqual(400);
  });
});

describe('User API, Removes movie from user profile', () => {
  it('should remove movie object from the user document', async () => {
    const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: testUser.username, password: testUser.password})

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('accessToken'); // Ensure token exists
    
    const token = loginRes.body.accessToken;
    if (!token) {
      throw new Error('Login failed, no accessToken returned');
    }
    
    const res = await request(app)
    .delete('/api/users/removeMovie')
    .set('Authorization', `Bearer ${token}`) // Set the Bearer token
    .set('Credentials', `Include`)
    .send(exampleMovie)
    
    // expect(res.body.error).toBe("Blank error");
    expect(res.statusCode).toEqual(200);
  });
});

// describe('User API, Removes movie from user profile that doesnt exist ', () => {
//   it('should remove movie object from the user document', async () => {
//     const res = await request(app)
//     .delete('/api/users/removeMovie')
//     .send({
//       userID: '670492144e48ae47202db5a2',
//       movieData: {
//         Title: 'Star Wars: Episode V - The Empire Strikes Back',
//         Year: '1980',
//         Rated: 'PG',
//         Released: '18 Jun 1980',
//         Runtime: '124 min',
//         Genre: 'Action, Adventure, Fantasy',
//         Director: 'Irvin Kershner',
//         Writer: 'Leigh Brackett, Lawrence Kasdan, George Lucas',
//         Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher',
//         Plot: 'After the Empire overpowers the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda. At the same time, Darth Vader and bounty hunter Boba Fett pursue his friends across the galaxy.',
//         Language: 'English',
//         Country: 'United States, United Kingdom',
//         Awards: 'Won 1 Oscar. 27 wins & 20 nominations total',
//         Poster: 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
//         Ratings: [
//           { Source: 'Internet Movie Database', Value: '8.7/10' },
//           { Source: 'Rotten Tomatoes', Value: '95%' },
//           { Source: 'Metacritic', Value: '82/100' }
//                 ],
//         Metascore: '82',
//         imdbRating: '8.7',
//         imdbVotes: '1,400,371',
//         imdbID: 'tt0080684',
//         Type: 'movie',
//         DVD: 'N/A',
//         BoxOffice: '$292,753,960',
//         Production: 'N/A',
//         Website: 'N/A',
//         Response: 'True'
//       }
//     })
//     expect(res.statusCode).toEqual(400);
//   });
// });

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