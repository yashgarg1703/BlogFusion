require("dotenv").config()

const express=require('express')
const app=express()
const path=require('path')
// const path=require('path')
// const multer  = require('multer')
const Router=require("./router/auth-router")
const AdminRouter=require("./router/admin-router")
const connectdb=require("./utlis/db")



// Middleware to attach io to request object
app.use((req, res, next) => {
  next();
});

///***FOR CORS POLICY..to make run frontend with backend ****/
var cors = require('cors')
const errorHandler = require("./middlewares/error-handling-midware")

var corsOptions = {
    origin: 'http://localhost:5173',
    methods:'POST,GET,DELETE,PATCH,HEAD,PUT',
    credentials:true
  }

  app.use(cors(corsOptions)) 


///****to make application support JSON format****/
app.use(express.json()); //middleware
app.use('/createBlog',express.static(path.join(__dirname, '../client/src/uploads')));
// app.get("/home",(req,res)=>{
//     res.status(200).send("Welcome to Home Route")
// })
app.use(errorHandler); //middleware for sending error from backend to frontend
/******** Using Express.js Routers ********/
app.use("/",Router)
app.use("/admin",AdminRouter)

connectdb().then(()=>
    {
        app.listen(3000,()=>{
            console.log("PORT -> 3000 IS ACTIVE")
        })
})

