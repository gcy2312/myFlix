const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
// const Actors = Models.Actor;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));

//GET list of all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) =>{
            res.status(201).json(movies);
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//GET data 1 movie
app.get('/movies/:Title', (req, res) =>{
    Movies.findOne({Title: req.params.Title})
    .then((movie) =>{
        res.json(movie);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//get data 1 genre
app.get('/movies/genres/:Genre', (req,res) =>{
    Movies.findOne({'Genre.Name': req.params.Genre})
    .then((genre) =>{
        res.json(genre);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//get data 1 director
app.get('/movies/directors/:Name', (req, res) =>{
    Movies.findOne({'Director.Name': req.params.Name})
    .then((director) =>{
        res.json(director);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//add user
app.post('/users', (req, res) =>{
    Users.findOne({Username: req.body.Username})
    .then((user) =>{
        if(user){
            return res.status(400).send(req.body.Username + 'already exists.');
        }else{
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user)})
            .catch((err) =>{
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//update user
app.put('/users/:Username', (req, res) =>{
    Users.findOneAndUpdate({Username: req.params.Username}, {$set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
        }
    }, {new: true},
    (err, updatedUser) =>{
        if(err){
            console.error(err);
            res.status(500).send('Error: ' + err);
        }else{
            res.json(updatedUser);
        }
    });
});

//add movie to favorites
app.post('/users/:Username/favorites/:MovieID', (req, res) =>{
    Users.findOneAndUpdate({Username: req.params.Username}, {$addToSet: {FavoriteMovies: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) =>{
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        }else{
            res.json(updatedUser);
        }
    });
});

//remove movie from favorites
app.delete('/users/:Username/favorites/:MovieID', (req, res) =>{
    Users.findOneAndUpdate({Username: req.params.Username}, {$pull: {FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//deregister user
app.delete('/users/:Username', (req, res) =>{
    Users.findOneAndRemove({Username: req.params.Username})
    .then((user)=>{
        if(!user){
            res.status(400).send(req.params.Username + ' was not found.');
        }else{
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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


