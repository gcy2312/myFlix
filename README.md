## myFlix-API
To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

Link to live project: https://myflix-movie-api-2312.herokuapp.com/


## User Stories

As a user, I want to be able to receive information on movies, directors, and genres so that I
can learn more about movies I’ve watched or am interested in.

As a user, I want to be able to create a profile so I can save data about my favorite movies.

## Features

● Return a list of ALL movies to the user

● Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user

● Return data about a genre (description) by name/title (e.g., “Thriller”)

● Return data about a director (bio, birth year, death year) by name

● Allow new users to register

● Allow users to update their user info (username, password, email, date of birth)

● Allow users to add a movie to their list of favorites

● Allow users to remove a movie from their list of favorites

● Allow existing users to deregister

## Technical Requirement
API - Node.js and Express application.

Use REST architecture, with URL endpoints corresponding to the data
operations listed above

3 middleware modules, such as the body-parser package for
reading data from requests and morgan for logging.

Built using MongoDB.

Business logic modeled with Mongoose.

Movie information in JSON format.

Tested in Postman.

Include user authentication and authorization code.

Deployed to Heroku.


