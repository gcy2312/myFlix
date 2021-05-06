const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    // Actors: [{type: mongoose.Schema.Types._id, ref: 'Actor'}],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//bcrypt hashing password
userSchema.static.hashPassword = (password) =>{
    return bcrypt.hashSync(password, 10);
};
userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
// let Actor = mongoose.model('Actor', actorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
// module.exports.Actor = Actor;