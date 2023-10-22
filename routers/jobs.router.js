const authMW = require('../middlewares/auth.mw')
const express = require('express')
const jobsController = require('../controllers/jobs.controller')
const jobsRouter = express.Router()

jobsRouter.post('/job',authMW,jobsController.postJob)
jobsRouter.patch('/job/:id',authMW,jobsController.editJob)
jobsRouter.delete('/job/:id',authMW,jobsController.deleteJob)
jobsRouter.get('/job/:id',jobsController.getJob)
jobsRouter.get('/jobs',jobsController.getJobs)
jobsRouter.get('/my-jobs',authMW,jobsController.getMyJobs)
jobsRouter.get('/pending-jobs',jobsController.getPendingJobs)
jobsRouter.patch('/accept-job/:id',authMW,jobsController.acceptJob)
jobsRouter.post('/apply-job/:id',authMW,jobsController.applyJob)
jobsRouter.get('/get-appliers/:id',jobsController.getAppliers)

module.exports = jobsRouter