const multer = require('multer')
const fs = require('fs')
const path = require('path')

var cvStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/uploads/CVs')
    },
    filename: function (req, file, cb) {
        cb(null, (Date.now()+'-'+file.originalname).replace(/ /g,""))
    }
})

var avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/uploads/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, (Date.now()+'-'+file.originalname).replace(/ /g,""))
    }
})

const imageFileFilter = (req,file,cb)=>{
    const extension = path.extname(file.originalname)
    if((extension == '.png')||(extension == '.jpg')||(extension === '.jpeg')){
        cb(null,true)
    }else{
        cb(new Error({ message: 'file must be image'}),false)
    }
}

const CVFileFilter = (req,file,cb)=>{
    const extension = path.extname(file.originalname)
    if(extension == '.pdf'){
        cb(null,true)
    }else{
        cb(new Error({ message: 'file must be pdf'}),false)
    }
}

const fileSize = {fileSize : 1024*1024} //1 MB

const avatarUploader = multer({
    storage:avatarStorage,
    fileFilter:imageFileFilter,
    limits:fileSize
}).single('avatar')

const cvUploader = multer({
    storage:cvStorage,
    fileFilter:CVFileFilter,
    limits:fileSize
}).single('cv')

const deleteFile = (path) =>{
    if(!! path){
        fs.unlink(path,()=>{
            console.log('file deleted')
        })
    }
}

module.exports = {
    deleteFile,
    cvUploader,
    avatarUploader
}
