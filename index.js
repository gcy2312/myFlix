const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express();
app.use(morgan('common'));

const movies = [
    {
        title: 'Fantastic Beasts and Where to Find Them',
        director: 'David Yates'
    },
    {
        title: 'The Hobbit: An Unexpected Journey',
        director: 'Peter Jackson'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher'
    },
    {
        title: 'The Matrix',
        director: 'Lana Wachowski'
    },
    {
        title: 'Back to the Future',
        director: 'Robert Zemeckis'
    },
    {
        title: 'Lord of the Rings: Fellowship of the Ring',
        director: 'Peter Jackson'
    }
];
const users = [];

//GET list of all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

//GET data 1 movie
app.get('/movies/:title', (req, res) =>{
    res.json(movies.find((movie) =>{
        return movie.title === req.params.title
    }));
});

//get data 1 genre
app.get('/movies/genres/:Genre', (req,res) =>{
    res.send('Successful GET request returning data on a specific genre');
});

//get data 1 director
app.get('/movies/directors/:Name', (req, res) =>{
    res.send('Successful GET request returning data on a specific director');
});

//add user
app.post('/users', (req, res) =>{
    res.send('Successful POST request adding new user account');
});

//update user
app.put('/users/:Username', (req, res) =>{
    res.send('Successful PUT request updating data of user');
});

//add movie to favorites
app.put('/users/:Username/favorites/:MovieID', (req, res) =>{
    res.send('Successful PUT request updating users favorites list');
});

//remove movie from favorites
app.delete('/users/:Username/favorites/:MovieID', (req, res) =>{
    res.send('Successful DELETE request removing data from users favorites list');
});

//deregister user
app.delete('/users/:Username', (req, res) =>{
    res.send('Successful DELETE request removing user data');
});

app.get('/', (req, res) =>{
    res.send('Welcome to myFlix!');
});

app.use(express.static('public'));

app.use((err, req, res, next) =>{
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () =>{
    console.log('This app is listening at port 8080.');
});


