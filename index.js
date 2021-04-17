const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));

const topMovies = [
    {
        name: 'Fantastic Beasts and Where to Find Them',
        director: 'David Yates'
    },
    {
        name: 'The Hobbit: An Unexpected Journey',
        director: 'Peter Jackson'
    },
    {
        name: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        name: 'Fight Club',
        director: 'David Fincher'
    },
    {
        name: 'The Matrix',
        director: 'Lana Wachowski'
    },
    {
        name: 'Back to the Future',
        director: 'Robert Zemeckis'
    },
    {
        name: 'Lord of the Rings: Fellowship of the Ring',
        director: 'Peter Jackson'
    }
];

app.get('/movies', (req, res) => {
    res.json(topMovies);
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


