const User = require('../database/models/user.model')

const AuthMW = async (request,response,next) => {
    try{
        const token = request.header('Authorization')
        if(! token){
            throw new Error({
                message: 'unauthorized request'
            })
        }
        const user = await User.findByToken(token)
        if(! user){
            throw new Error({
                message: 'invalid token'
            })
        }
        request.user = user
        next()
    }
    catch(err){
        response.status(401).send(err)
    }
}

module.exports = AuthMW