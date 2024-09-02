const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    },
    tag: [{
        type: String,
       
        required: true
    }],
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog_Image'
    },
    videos: {
        type: String,
    },
    slug: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
