const express = require('express')
const userController = require('../controllers/user.controller')
const authMW = require('../middlewares/auth.mw')
const userRouter = express.Router()

userRouter.post('/signup',userController.signup)
userRouter.post('/login',userController.login)
userRouter.post('/auto-login',userController.autoLogin)
userRouter.post('/completeData',userController.completeData)
userRouter.patch('/make-admin/:id',authMW,userController.makeAdmin)
userRouter.patch('/update-email',authMW,userController.updateEmail)
userRouter.patch('/update-info',authMW,userController.updateInfo)
userRouter.patch('/update-password',authMW,userController.updatePassword)
userRouter.post('/avatar',authMW,userController.uploadAvatar)
userRouter.post('/cv',authMW,userController.uploadCV)

module.exports = userRouter
