const Category = require('../database/models/category.model')
const {mapError} = require('../helpers/helpers')

const getCategories = (request,response,next) => {
        Category.findAll().then(docs=>{
            response.json(docs)
            next()
        }).catch(err=>{
            response.status(500).json(err)
        })
}
const postCategory = async (request,response,next) =>{
    const user = request.user
    if(! user.admin){
        return response.status(401).json({
            message: 'unauthorized request'
        })
    }
    const {title} = request.body
    try{
            const found = await Category.findOne({where:{title:title}})
            if(found){
                return response.status(406).send({
                    message: 'duplicated category title'
                })
            }
            const category = new Category({title})
            await category.save()
            response.json(category)
            next()
    }catch(err){
        if(err.errors){
            return response.status(406).send(mapError(err))
        }
        response.status(500).send(err)
    }
}
const editCategory = async (request,response,next) => {
    const user = request.user
    if(! user.admin){
        return response.status(401).json({
            message: 'unauthorized request'
        })
    }
    const {id} = request.params
    const {title} = request.body
    try{
        const category = await Category.findByPk(id)
        if(!category){
            return response.status(404).json({
                message: `category with id ${id} not found`
            })
        }
        category.title = title
        const edited = await category.save()
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
const deleteCategory = async (request,response,next) => {
    const user = request.user
    if(! user.admin){
        return response.status(401).json({
            message: 'unauthorized request'
        })
    }
    const {id} = request.params
    try{
        const category = await Category.findByPk(id)
        if(! category){
            return response.status(404).json({
                message: `category with id ${id} not found`
            })
        }
        await category.destroy()
        response.json({
            message: 'category deleted'
        })
        next()
    }
    catch(err){
        response.status(500).json(err)
    }
}
module.exports = {
    postCategory,
    editCategory,
    deleteCategory,
    getCategories
}
