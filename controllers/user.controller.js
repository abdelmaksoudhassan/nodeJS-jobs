const User = require('../database/models/user.model')
const ExtraData = require('../database/models/extra-data.model')
const {avatarUploader,cvUploader,deleteFile} = require('../multer/multer.setting')
const {mapError} = require('../helpers/helpers')

const signup = async (request,response,next) => {
    const {email,password,firstName,lastName,age} = request.body
    const found = await User.findOne({where:{email:email}})
    if(found){
        return response.status(406).send({
            message: 'duplicated email'
        })
    }
    const user = new User({firstName,lastName,age,email,password})
    user.save().then(()=>{
        response.json({
            message: 'registered successfully'
        })
        next()
    }).catch(err=>{
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    })
}
const login = async (request,response,next) => {
    const {email,password} = request.body
    try{
        const user = await User.findOne({where:{email}})
        if(! user){
            return response.status(404).send({
                message: `${email} not found`
            })
        }
        const equaled = await user.comparePassword(password)
        if(! equaled){
            return response.status(401).send({
                message: `wrong password`
            })
        }
        const token = await user.generateToken()
        if(user.admin){
            response.status(200).json({user,token})
        }else{
            const extraData = await ExtraData.findOne({where:{UserId: user.id}})
            response.status(200).json({user,extraData,token})
        }
        next()
    }catch(err){
        response.status(401).json(err)
    }
}
const autoLogin = async (req,res,next) =>{
    const token = req.header('Authorization')
    if(! token){
        return res.status(401).send({
            message: 'unauthenticated user'
        })
    }
    try{
        const user = await User.findByToken(token)
        if(!user){
            return res.status(401).send({
                message: 'expired token'
            })
        }
        if(user.admin){
            response.status(200).json(user)
        }else{
            const extraData = await ExtraData.findOne({where:{UserId: user.id}})
            response.status(200).json({user,extraData})
        }
        next()
    }
    catch(e){
        res.status(500).json(e)
    }
}
const makeAdmin = async (request,response,next) => {
    try{
        const {admin} = request.user
        const id = request.params.id
        if(! admin){
            return response.status(401).send({
                message: 'unauthorized request'
            })
        }
        const user = await User.findByPk(id)
        if(! user){
            return response.status(404).send({
                message: `user with id ${id} not found`
            })
        }
        user.admin = true
        await user.save()
        // once user updated to be admin delete his extra data
        const userExtraData = await ExtraData.findOne({where:{UserId:user.id}})
        if(userExtraData){
            deleteFile(userExtraData.cv)
            await userExtraData.destroy()
        }
        response.send({
            message: `user updated to be admin`
        })
    }catch(err){
        response.status(500).send(err)
    }
}
const uploadAvatar = (request,response,next) => {
    const user = request.user
    const oldImage = user.avatar

    avatarUploader(request,response,(err)=>{
        if (err) {
            return response.status(400).json({
                message: 'invalid file',
                error: err
            })
        }
        if(! request.file){
            response.status(422).json({
                message: 'image must be choosen'
            })
        }
        user.avatar = request.file.path
        user.save().then(doc=>{
            if(oldImage){
                deleteFile(oldImage)
            }
            response.json({
                message: 'avatar updated',
                avatar: request.file.path
            })
            next()
        }).catch(e=>{
            deleteFile(request.file.path)
            response.status(500).json(e)
        })
    })
}
const updateInfo = (request,response,next) => {
    const {firstName,lastName,age} = request.body
    const user = request.user

    user.firstName = firstName
    user.lastName = lastName
    user.age = age

    user.save().then(res=>{
        response.json(res)
        next()
    }).catch(err=>{
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    })
}
const updateEmail = async (request,response,next) => {
    const {email,password} = request.body
    const user = request.user
    try{
        const equaled = await user.comparePassword(password)
        if(! equaled){
            return response.status(401).json({
                message: 'wrong password'
            })
        }
        user.email = email
        const updated = await user.save()
        response.json(updated)
        next()
    }
    catch(err){
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    }
}
const updatePassword = async (request,response,next) => {
    const {oldPassword,newPassword} = request.body
    const user = request.user
    try{
        const same = await user.comparePassword(oldPassword)
        if(! same){
            return response.status(401).json({
                message: 'wrong password'
            })
        }
        user.password = newPassword
        await user.save()
        response.json({
            message: 'password updated'
        })
        next()
    }
    catch(err){
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    }
}
const uploadCV = (request,response,next) => {
    const user = request.user
    if(user.admin){
        return response.status(406).send({
            message: 'admins not allowed to upload CVs'
        })
    }
    cvUploader(request,response,async (err)=>{
        if (err) {
            return response.status(400).json({
                message: 'invalid file',
                error: err
            })
        }
        if(! request.file){
            return response.status(422).json({
                message: 'image must be choosen'
            })
        }
        try{
            const userExtraData = await ExtraData.findOne({where:{UserId:user.id}})
            const oldCv = userExtraData.cv
            userExtraData.cv = request.file.path
            await userExtraData.save()
            if(oldCv){
                deleteFile(oldCv)
            }
            response.send({
                message: 'cv updated',
                cv: userExtraData.cv
            })
            next()
        }catch(err){
            deleteFile(request.file.path)
            response.status(500).send(err)
        }
    })
}
const completeData = (request,response,next) => {
    const user = request.user
    if(user.admin){
        return response.status(406).send({
            message: 'admins not allowed for this request'
        })
    }
    cvUploader(request,response,async (err)=>{
        if (err) {
            return response.status(400).json({
                message: 'invalid file',
                error: err
            })
        }
        if(! request.file){
            return response.status(422).json({
                message: 'image must be choosen'
            })
        }
        try{
            const {specialty} = request.body
            const userExtraData = new ExtraData({cv: request.file.path,UserId: user.id,categoryId: specialty})
            await userExtraData.save()
            response.json(userExtraData)
            next()
        }catch(err){
            deleteFile(request.file.path)
            if(err.errors){
                return response.status(406).send(mapError(err))
            }
            response.status(500).send(err)
        }
    })
}
module.exports = {
    makeAdmin,
    signup,
    login,
    autoLogin,
    uploadAvatar,
    uploadCV,
    updateInfo,
    updateEmail,
    updatePassword,
    completeData
}
