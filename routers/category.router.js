const express = require('express')
const categoryRouter = express.Router()
const categoryController = require('../controllers/category.controller')
const authMW = require('../middlewares/auth.mw')

categoryRouter.post('/category',authMW,categoryController.postCategory)
categoryRouter.patch('/category/:id',authMW,categoryController.editCategory)
categoryRouter.delete('/category/:id',authMW,categoryController.deleteCategory)
categoryRouter.get('/categories',categoryController.getCategories)

module.exports = categoryRouter