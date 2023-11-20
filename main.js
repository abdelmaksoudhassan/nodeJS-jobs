const express = require('express')
const bodyParser = require('body-parser')

const sequelize = require('./database/connection')
const userRouter = require('./routers/user.router')
const categoryRouter = require('./routers/category.router')
const jobsRouter = require('./routers/jobs.router')
const User = require('./database/models/user.model')

require('dotenv').config({ path:'./vars.env' })

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/',express.static(__dirname))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const port = process.env.PORT || 3000
require('./database/relations')

app.use(userRouter)
app.use(categoryRouter)
app.use(jobsRouter)
app.get('/',(req,res,next)=>{
    res.send('welcome from server')
})

// sequelize.sync({force:true}).then(() => {
sequelize.sync().then(() => {
    console.log('database connected')
    // return User.create({firstName:'ahmed',lastName:'hassan',admin:true,age:25,email:'new_admin@gmail.com',password:'12345678'})
}).then(()=>{
    app.listen(port,()=>{
        console.log(`server up on port ${port}`)
    })
}).catch(err => {
    console.log('database disconnected',err);
});
