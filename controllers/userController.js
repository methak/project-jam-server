const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

exports.findOrCreateUser = async token => {
    // verify auth token
    const googleUser = await verifyAuthToken(token)
    // check if user exist
    const user = await checkIfUserExitsts(googleUser.email)
    console.log('USER -->',user);
    // if user exists, return  them otherwise, create new user in db
    return user ? user : createNewUser(googleUser)
}

const verifyAuthToken = async token => {
    console.log('ENV -> ',process.env.OAUTH_CLIENT_ID);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID

        })
        console.log(ticket.getPayload());
        return ticket.getPayload()
    } catch (err) {
        console.error("Error verifing auth token", err)
    }
}

const checkIfUserExitsts = async email => await User.findOne({email}).exec()

const createNewUser = googleUser => {
    const { name, email, picture } = googleUser
    const user = { name, email }
    console.log('Creating New USer -->', user)
    return new User(user).save()
}