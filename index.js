//require modules***
const bodyParser = require('body-parser');
const cors = require('cors'); //CORS data secrutiy
const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const morgan = require('morgan');


//require local files
const Models = require('./models.js'); //require local models.js file
require('./passport'); // require local passport.js file
const generateAuth = require('./auth');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});    //local DB

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });  //connection URI

const app = express();
app.use(cors()); //CORS data default all origins
app.use(bodyParser.json());
app.use(morgan('common'));

generateAuth(app);  // require local auth.js file
const passport = require('passport'); //require local passport(login)

//GET list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//GET data 1 movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//get data 1 genre
app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Genre })
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//get data 1 director
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//add user
app.post('/users',
    [//validation logic
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email not vaid').isEmail()

    ],
    (req, res) => {
        //check the validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }) //search to see if user exists
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + 'already exists.');
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                        .then((user) => { res.status(201).json(user) })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).send('Error: ' + err);
                        })
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
    });
// Get a user by username
app.get("/users/:username", (req, res) => {
    Users.findOne({ Username: req.params.username })
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});
//update user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
    [//validation logic
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email not valid').isEmail(),
    ],
    (req, res) => {
        //check the validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set: {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        }, { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });

//add movie to favorites
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $addToSet: { FavoriteMovies: req.params.MovieID }
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

//remove movie from favorites
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
}
);


