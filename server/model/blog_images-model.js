const mongoose = require('mongoose')

const blogImageSchema = new mongoose.Schema({
    blog_id:{
       type:mongoose.Schema.Types.ObjectId
    },
    image:[{
        type:String
    }]
})

const Blog_Image = new mongoose.model('Blog_Image',blogImageSchema)

module.exports = Blog_Image