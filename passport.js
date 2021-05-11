const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

//define authentication strategies
let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//http strategy for login
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            return callback(error);
        }

        if (!user) {
            return callback(null, false, { message: 'Incorrect username.' });
        }

        if (!user.validatePassword(password)){
            return callback(null, false, {message: 'Incorrect password'});
        }

        console.log('finished');
        return callback(null, user);
    });
}));

//JWT strategy for access
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));