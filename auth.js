const jwtSecret = process.env.JWT_TOKEN; // same JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // local passport file

/**
 * generate JWT token
 * subject-username encoding in JWT
 * expires- specifies that token will expire in 7 days
 * algorithm- algorithm used to encode value of JWT
 * @param {string} user - the user
 * @returns JWTToken
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // username encoded to JWT
        expiresIn: '7d', // Expire in 7 days
        algorithm: 'HS256' // algorithm used to “sign” /encode values of JWT
    });
}


/**
 *  a module that exports the auth routing - POST login request
 * @module router
*/
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}