const jwt = require('jsonwebtoken')
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

    User.findOne({ 'username': username })
        .then(savedUser => {
            if (!savedUser) {
                const error = new Error('Incorrect email or password')
                error.name = 'IncorrectCredentialsError'

                return done(error)
            }
            let hashedPassword = encryption.generateHashedPassword(savedUser.salt, reqUser.password)
            
            const isMatch = savedUser.hashedPass === hashedPassword

            if (!isMatch) {
                const error = new Error('Incorrect email or password')
                error.name = 'IncorrectCredentialsError'

                return done(error)
            }

            const payload = {
                sub: savedUser._id
            }

            // create a token string
            const token = jwt.sign(payload, 's0m3 r4nd0m str1ng')
            const data = {
                name: savedUser.username
            }

            return done(null, token, data)
        })
        .catch(error => {
            return done(error)
        })
})
