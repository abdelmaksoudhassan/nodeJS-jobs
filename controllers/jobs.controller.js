const Job = require('../database/models/job.model')
const User = require('../database/models/user.model')
const Category = require('../database/models/category.model')
const {mapError} = require('../helpers/helpers')

const postJob = (request,response,next) =>{
    const {gender,title,requirements,type,salary,categoryId} = request.body
    const user = request.user
    user.createJob({gender,title,requirements,type,salary,categoryId}).then(doc=>{
        response.status(201).json(doc)
        next()
    }).catch(err=>{
        console.log(err)
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    })
}
const editJob = async (request,response,next) => {
    const user = request.user
    const {id} = request.params
    const{title,requirements,type,gender,salary,categoryId} = request.body
    try{
        const job = await Job.findByPk(id)
        if(! job){
            return response.status(404).send({
                message: `job with id ${id} not found`
            })
        }
        if(job.UserId !== user.id){
            return response.status(401).send({
                message: 'unauthorized request'
            })
        }
        const edited = await job.update({title,requirements,type,gender,salary,categoryId})
        response.json(edited)
        next()
    }
    catch(err){
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    }
}
const deleteJob = async (request,response,next) => {
    const user = request.user
    const {id} = request.params
    try{
        const job = await Job.findByPk(id)
        if(! job){
            return response.status(404).send({
                message: `job with id ${id} not found`
            })
        }
        if(job.UserId !== user.id && ! user.admin){
            return response.status(401).send({
                message: 'unauthorized request'
            })
        }
        await job.destroy()
        response.json({
            message: 'job deleted'
        })
        next()
    }
    catch(err){
        response.status(500).send(err)
    }
}
const getJob = async (request,response,next) => {
    const {id} = request.params
    try{
        const job = await Job.findByPk(id,{
            include:[{model: User,attributes:{exclude:['password']}},{model: Category}],
            attributes:{
                exclude:['UserId','categoryId','cv']
            }
        })
        if(! job){
            return response.status(404).send({
                message: `job with id ${id} not found`
            })
        }
        const appliersCount = await job.countUsers()
        response.json({job,appliersCount})
        next()
    }
    catch(err){
        console.log(err)
        response.status(500).send(err)
    }
}
const getJobs= (request,response,next) => {
    const page = +request.query.page
    const limit = +request.query.count
    Job.findAndCountAll({where:{approved:true},limit,offset:(page-1)*limit}).then(jobs=>{
        console.log(jobs)
        response.json({
            jobs:jobs.rows,
            currentPage:page,
            hasNextPage: limit*page<jobs.count,
            hasPreviousPage: page>1,
            nextPage: ((jobs.count/(limit*page) >1) ? page+1 : null),
            previousPage: (page>1 ? page-1 : null ),
            lastPage:Math.ceil(jobs.count/limit),
            total:jobs.count,
            pagesNum: Math.round(jobs.count/limit)
        })
        next()
    }).catch(err=>{
        response.status(500).send(err)
    })
}
const getMyJobs = (request,response,next) =>{
    const user = request.user
    user.getJobs({
        include:[{model: Category}],
        attributes:{
            exclude:['UserId','categoryId','cv']
        }
    }).then(docs=>{
        response.json(docs)
        next()
    }).catch(err=>{
        response.status(500).send(err)
    })
}
const getPendingJobs = (request,response,next) =>{
    Job.findAll({where:{approved: false},
        include:[{model: Category},{model: User,attributes:{exclude:['password']}}],
        attributes:{
            exclude:['UserId','categoryId','cv']
        }
    }).then(docs=>{
        response.json(docs)
        next()
    }).catch(err=>{
        response.status(500).send(err)
    })
}
const acceptJob = async (request,response,next) => {
    const user = request.user
    const {id} = request.params
    if(! user.admin){
        return response.status(401).send({
            message: 'unauthorized request'
        })
    }
    try{
        const job = await Job.findByPk(id)
        if(! job){
            return response.status(404).send({
                message: `job with id ${id} not found`
            })
        }
        if(job.approved){
            return response.status(400).send({
                message: `job with id ${id} already approved`
            })
        }
        job.approved = true
        await job.save()
        response.json({
            message: 'job approved'
        })
        next()
    }
    catch(err){
        response.status(500).send(err)
    }
}
const applyJob = async (request,response,next) => {
    const user = request.user
    const {id} = request.params
    if(user.admin){
        return response.status(400).send({
            message: 'admins not allowed to apply jobs'
        })
    }
    try{
        const job = await Job.findByPk(id)
        if(! job){
            return response.status(404).send({
                message: `job with id ${id} not found`
            })
        }
        const appliers = await job.getUsers()
        if(appliers.filter(applier=>applier.id == user.id).length > 0){
            return response.status(400).send({
                message: 'user already applied'
            })
        }
        await job.addUser(user.id)
        response.json({
            message: 'applied successfully'
        })
        next()
    }
    catch(err){
        response.status(500).send(err)
    }
}
const getAppliers = async (request,response,next) => {
    const {id} = request.params
    try{
        const job = await Job.findByPk(id)
        if(! job){
            return response.status(404).send({
                message: `job with id ${id} not found`
            })
        }
        const appliers = await job.getUsers({attributes:{exclude:['user_job']}})
        response.json(appliers)
        next()
    }
    catch(err){
        response.status(500).send(err)
    }
    
}
module.exports = {
    postJob,
    editJob,
    deleteJob,
    getJob,
    getJobs,
    getMyJobs,
    acceptJob,
    applyJob,
    getAppliers,
    getPendingJobs
}