const Blog = require("../model/blog-model");
const Blog_Image = require("../model/blog_images-model");
const Tag = require("../model/tag-model");
const Blog_Tag = require("../model/blog-tag-model")

const AddBlog = async (req, res) => {
    try {
      console.log(req.body, "Request body");
      console.log(req.files, "Uploaded files");
  
      const { title, description, tag, slug } = req.body;
      const parsedTags = JSON.parse(tag); 
  
      console.log(parsedTags);
  
      if (!req.files || !req.files.image || req.files.image.length === 0) {
        return res.status(400).json({ message: "Image upload failed!" });
      }
  
      const imageFiles = req.files.image;
      const videoFile = req.files.videos ? req.files.videos[0].filename : null;
  
      const imagePaths = imageFiles.map(imageFile => imageFile.filename);
  
      const findTitle = await Blog.findOne({ title: title });
  
      if (findTitle) {
        return res.status(400).json({ message: "This Blog Title Already exists" });
      }
  
      console.log(parsedTags, "Parsed Tags");
  
      // Save Blog_Image document first
      const blogImage = new Blog_Image({
        image: imagePaths,
      });
  
      await blogImage.save();
  
      // Now save Blog document with reference to the Blog_Image
      const blogData = new Blog({
        title: title,
        description: description,
        tag: parsedTags, 
        image: blogImage._id, 
        videos: videoFile,
        slug: slug,
      });
  
      await blogData.save();
  
      // Update Blog_Image with the blog_id
      await Blog_Image.findByIdAndUpdate(blogImage._id, { blog_id: blogData._id });
  
      // Find and save tags
      const tagIds = await Tag.find({ tags: { $in: parsedTags } });
  
      const blogtagData = tagIds.map((tag) => ({
        blog_id: blogData._id,
        tag_id: tag._id,
      }));
  
      await Blog_Tag.insertMany(blogtagData);
  
      res.status(200).json({ message: "Blog Data saved successfully" });
    } catch (error) {
      console.log(`Error while adding blog: ${error}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  


const viewBlog = async (req, res) => {
    try {
        const blogData = await Blog.find().populate('image'); 
        res.status(200).json(blogData);
    } catch (error) {
        console.log(`Error while viewing blog: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteThisBlog = async (req, res) => {
    try {
        const _id = req.query.id;
        const blogimageId = await Blog.findOne({_id:_id})
        await Blog_Image.findByIdAndDelete({_id:blogimageId.image})
        await Blog.findByIdAndDelete({ _id: _id });
        res.status(200).json({ message: `Blog deleted successfully with Id ${_id}` });
    } catch (error) {
        console.log(`Error while deleting this blog: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const AddTagsData = async (req, res) => {
    try {
        const { tags } = req.body;
        const tagData = new Tag({ tags: tags });
        await tagData.save();
        res.status(200).json({ message: 'Tag Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const viewTagsdata = async (req, res) => {
    try {
        const tagData = await Tag.find();
        res.status(200).json(tagData);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const viewSingleBlog = async (req, res) => {
    try {
        const { id } = req.params; 
        // console.log(id,"dfugu");
        
        const blog = await Blog.findById({_id:id}).populate('image');
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
// console.log(blog,"dfhil");

        res.status(200).json(blog);
    } catch (error) {
        console.log(`Error while viewing single blog: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tag, slug } = req.body;

        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        
        if (title && title !== existingBlog.title) {
            const findTitle = await Blog.findOne({ title });
            if (findTitle) {
                return res.status(400).json({ message: "This Blog Title Already exists" });
            }
        }

      
        if (req.files && req.files.image) {
            const imageFiles = [];

            
            if (Array.isArray(req.body.image)) {
                req.body.image.forEach((img) => {
                    const imageName = img.split('/').pop();
                    imageFiles.push(imageName);
                });
            } else if (req.body.image) {
                const imageName = req.body.image.split('/').pop();
                imageFiles.push(imageName);
            }

            console.log(req.files.image,"checking images in files");
            
            req.files.image.map((img) => (
                imageFiles.push(img.filename)
            ))

            // imageFiles.push(req.files.image.filename)

            console.log(imageFiles,"imagfidfh ihhh")

            let updatedImage;
            if (imageFiles.length > 0) {
                
                updatedImage = await Blog_Image.findOneAndUpdate(
                    { blog_id: id },
                    { image: imageFiles },
                    { new: true, upsert: true }  
                );

                if (!updatedImage) {
                    throw new Error('Failed to update or create Blog_Image document');
                }

                
                existingBlog.image = updatedImage._id;
            }
        }

       
        if (req.files && req.files.videos) {
            const videoFile = req.files.videos[0].filename;
            existingBlog.videos = videoFile;
        }

       
        existingBlog.title = title || existingBlog.title;
        existingBlog.description = description || existingBlog.description;
        existingBlog.tag = tag || existingBlog.tag;
        existingBlog.slug = slug || existingBlog.slug;

        await existingBlog.save();

        res.status(200).json({ message: "Blog Data Updated successfully" });
    } catch (error) {
        console.log(`Error while updating blog: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




const deleteImageSaved = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id,"jdfhuldgl");
        
      
        const image = await Blog_Image.findById(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

      
        await Blog_Image.findByIdAndDelete(id);

       
        await Blog.updateMany(
            { 'image': id },
            { $pull: { 'image': id } }
        );

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.log(`Error while deleting image: ${error}`);
        res.status(500).json({ message: "Internal Server Error While deleting image" });
    }
};




module.exports = { AddBlog, viewBlog, deleteThisBlog, AddTagsData, viewTagsdata ,viewSingleBlog,updateSingleBlog,deleteImageSaved};
