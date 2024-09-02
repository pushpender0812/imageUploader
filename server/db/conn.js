const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ImageUploader')
.then(() => {
    console.log("MongoDb Connected Successfully");
    
}).catch((err) => {
    console.log(`Error Conntecting Database ${err}`);
    
})