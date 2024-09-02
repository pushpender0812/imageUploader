const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({
    tags:{
        type:String,
        required:true,
        unique:true
    }
})

const Tag = new mongoose.model("Tag",tagSchema)

module.exports = Tag