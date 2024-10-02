// Import dependencies
const request = require('supertest');
const express = require('express');
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
// // Sample test for the health check route
// describe('Health Check API', () => {
//   it('should return a status 200 and message "OK"', async () => {
//     const res = await request(app).get('/api/health');
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toBe('OK');  // Adjust this based on your response structure
//   });
// });

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
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message');
  });
}); 

describe('Auth API (Invalid Login Credentials', () => {
    it('Should try to log in for an account with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'NewUser', password: 'example123' }); // Example payload
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message');
    });
  });

describe('Auth API (Login for Valid Account)', () => {
    it('Should try to log in for an account with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'NewUser', password: '1234' }); // Example payload
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
      expect(res.statusCode).toEqual(500);  // Adjust based on validation
    });
  }); 

// Test for movie routes
describe('Movie API', () => {
  it('should return a list of movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Assuming it returns an array of movies
  });
});

// Test for auth routes
describe('Auth API', () => {
  it('should authenticate a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'password123' }); // Example payload
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');  // Assuming it returns a token on login
  });
});