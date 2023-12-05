const express = require('express')
const bodyParser = require('body-parser')

const sequelize = require('./database/connection')
const userRouter = require('./routers/user.router')
const categoryRouter = require('./routers/category.router')
const jobsRouter = require('./routers/jobs.router')

require('dotenv').config({ path:'./vars.env' })

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/',express.static(__dirname))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://symphonious-cat-f7addf.netlify.app');
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
    next()
})

sequelize.sync().then(() => {
    console.log('database connected')
}).then(()=>{
    app.listen(port,()=>{
        console.log(`server up on port ${port}`)
    })
}).catch(err => {
    console.log('database disconnected',err);
});
