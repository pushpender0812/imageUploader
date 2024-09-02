const express = require('express')
const app = express()
const PORT = 8000
require('../server/db/conn')
const blogRoutes = require("./routes/blog-routes")
const cors = require('cors')


const corsOptions = {
    origin:"http://localhost:5173",
    method:"GET,POST,PUT,PATCH,DELETE,HEAD",
    credential:true
}

app.use(cors(corsOptions))
app.use('/uploads', express.static('uploads'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res) => {
    res.send('hello')
})

app.use('/blog',blogRoutes)


app.listen(PORT,() => {
    console.log(`server running on PORT ${PORT}`)
})