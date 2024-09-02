const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { AddBlog, viewBlog, deleteThisBlog, AddTagsData, viewTagsdata,viewSingleBlog,updateSingleBlog,deleteImageSaved } = require('../controllers/blog-controllers');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, './uploads/images/');
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, './uploads/videos/');
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });



router.route('/add-blog').post(upload.fields([{ name: 'image', maxCount: 10 }, { name: 'videos', maxCount: 1 }]), AddBlog);
router.route('/view-blog').get(viewBlog);
router.route('/delete-blog').post(deleteThisBlog);

router.route('/add-tags').post(AddTagsData);
router.route('/view-tags').get(viewTagsdata);

router.route('/view-singleBlog/:id').get(viewSingleBlog)


router.route('/update-blog/:id').post(upload.fields([{ name: 'image', maxCount: 10 }, { name: 'videos', maxCount: 1 }]),updateSingleBlog)

router.route('/delete-image/:id').post(deleteImageSaved)


module.exports = router;
