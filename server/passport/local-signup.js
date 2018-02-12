const PassportLocalStrategy = require('passport-local').Strategy
const User = require('mongoose').model('User')
const encryption = require('../utilities/encryption')

module.exports = new PassportLocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, username, password, done) => {
    let reqUser = req.body
    // Add validations!
    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.findOne({ 'username': username })
        .then(existingUser => {
            if (existingUser) {
                return done('Username already exists!')
            }

            User.create({
                username: username,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                salt: salt,
                hashedPass: hashedPassword
            })
                .then(user => {
                    return done(null)
                })
                .catch(err => {
                    if (err.code === 11000) {
                        return done('Username already exists!');
                    }
                })
        })
})
