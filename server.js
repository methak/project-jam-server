const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { findOrCreateUser } = require('./controllers/userController')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => console.log('DB connected!'))
.catch(err => console.log(err))

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context: async ({req,res}) => {
        let authToken = null
        let currentUser = null
        
        try {
            authToken = req.headers.authorization
            
            console.log('Token --> ',authToken);
            if (authToken){
                // find or create user
                currentUser = await findOrCreateUser(authToken)
            }
        } catch (err) {
            console.error(`Unable to authenticate user with token ${authToken}`);
        }
        return { currentUser }
        //return  res.status(201).json(currentUser); 
    }
})

server.listen().then(({ url}) => {
    console.log(`🚀Server listening on ${url}🎉`);
})