const mongoose = require('mongoose')

const blog_tagSchema = new mongoose.Schema({
    blog_id:{
        type:mongoose.Schema.Types.ObjectId
     },
     tag_id:{
         type:mongoose.Schema.Types.ObjectId
     }
})

const Blog_Tag = new mongoose.model("Blog_Tag",blog_tagSchema)

module.exports = Blog_Tag