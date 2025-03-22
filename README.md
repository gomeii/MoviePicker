# Getting Started with the MoviePicker Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description 

This is a personal project I created to try and get familiar with web development frameworks and full stack development. This is a simple full stack application that uses the OMDb API to query movies and tv-shows. This also allows users to sign up and login and save the movies/shows that they like to their account as well as remove the movies/shows that they do not like anymore. It is supposed to be a cheap imitiation of sites such as letterbox and imdb. 

## Directory Structure

This directory contains a Client (Frontend) structure made mostly with React and CSS, a Server (Backend) strucutre made mostly of the MongoDB manipulation from the api routes using Express and Mongoose as the mongo driver. This directory most likely has some unecessary node packages that I gathered over the time of working on this. 

    |- Frontend
    | |- public (landing of create-react-app)
    | |- src (the bulk of the client components )
    | |- .env
    | |- .gitattributes (github misc)
    | |- .gitignore (github misc)
    | |- Dockerfile (container file to run locally)
    | |- package-lock.json (npm dependecies)
    | |- package.json (npm dependecies)
    |- Backend
    | |- controllers (express backend logic)
    | |- models (mongodb collection schema)
    | |- routes (api routing)
    | |- .env
    | |- Dockerfile (container file to run locally)
    | |- package-lock.json (npm dependecies)
    | |- package.json (npm dependecies)
    | |-tests
    |  |-server.test.js (backend api tests)
    |- docker-compose.yml (orchestrate containers)
    |- package-lock.json (npm dependecies)
    |- package.json (npm dependecies)
    |- README.md (what you are reading)


### Containerization 

This project comes equipped with Dockerfiles and docker-compose files to facilitate running the application locally.

### Pre-requisites

#### Docker

Make sure you have docker installed on your machine to be able to run the containers and orchestrate them using docker-compose 

That can be downloaded here: https://www.docker.com/get-started/

#### OMDb API Key 

You will need to create an OMDb API key at: 

`https://www.omdbapi.com/apikey.aspx`

We will reference to this key as: [API_KEY]

#### MongoDB Database

To utilize this repo you will need to create an account with MongoDB and create a free cluster for your database. Instructions on how to do this can be found here: https://www.mongodb.com/docs/atlas/getting-started/

Once you have created your MongoDb database you will need to get a connection string for an account that has the privelege to readAndWriteToAnyDatabase.
We will reference to this connection string as: [MONGO_URI]. It will be in the form of: "mongodb+srv://<username>:<password>:<cluster>/<database>..........", where the username and password are the credentials for the account with readAndWriteToAnyDatabase access.

#### FrontEnd Environment File

1. Navigate to the Frontend Folder
2. Create an .env File
4. .env file should be:

    `REACT_APP_API_URL=http://localhost:5000`

#### Backend Environment File

1. Navigate to the Backend Folder
2. Create an .env File
3. .env file should be:

    `PORT=5000`

    `MONGO_URI=[MONGO_URI]`

    `REACT_APP_OMDB_API_KEY=[API_KEY]`
    
    `LOG_LEVEL=[LOG_LEVEL]`

    `JWT_SECRET=[JWT_SECRET]`



## Quickstart Guide 

0. Make sure you have the pre-requisites listed above

1. Clone the repository to your local machine using the command
`git clone https://github.com/gomeii/MoviePicker.git"` in the terminal 
(or any other method of cloning repositories)

2. Open up a terminal

3. Navigate to the main folder `MoviePicker`

4. Run the command `docker compose build --no-cache`. This will create the containers for each of the structures of the application utilizing the docker-compose.yml file

5. Once the containers are finished building. Run the command `docker compose up`. This will start the containers.

6. From here you should be able to view the application from the browser at [http://localhost:3000]

#### Troubleshooting

Somtimes the local database takes a second to set up and this causes the frontend application not be able to do any of the functions relating to saving/removing or user authentication. An easy fix for this is to just restart the containers until they are all happy with the initialization
