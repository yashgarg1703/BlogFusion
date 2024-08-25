////**** This is to make server.js file more clean ****////
////**** This is basically refers to the path where to route ****////
const express=require('express')
const app=express();
const path=require('path')
// Serve static files from the "uploads" directory


const fs=require('fs')
// For image upload
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../client/src/uploads'))

    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null,'img-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  const upload = multer({ storage: storage })
////////////////////////////////////////////////////////////

const Router=express.Router()
const {home,blogs,register,login,contact,userData, createBlog, myBlogs, deleteBlog,updateBlog,getBlogbyID,addLike,removeLike, addComment,blogData,userDashboard,userBlogs,LikedBlogs,DisLikedBlogs,homeRecentBlogs}=require("../controllers/auth-controllers")
const authTokenValidator=require("../middlewares/authTokenValidator");
//    OR
// const authControllers=require("../controllers/auth-controllers")
const {signupSchema,loginSchema}=require("../validator/auth-validators");
const validate=require("../middlewares/zod-validators")

/****** Using Only Router *******/
// Router.get("/",(req,res)=>{
//     res.status(200).send("This is Home Route using Express.js Router")
// })

Router.route("/home").get(home)
Router.route("/home/recentBlogs").get(homeRecentBlogs)
//     OR
// Router.route("/home").get(authControllers.home)
Router.route("/blogs/:category").get(blogs)
Router.route("/register").post(validate(signupSchema),register)
Router.route("/login").post(validate(loginSchema),login)
Router.route("/contact").post(contact)
Router.route("/createBlog").post(authTokenValidator,upload.single('img'),createBlog)
Router.route("/myBlogs").get(authTokenValidator,myBlogs)
Router.route("/blogs/delete/:id").delete(authTokenValidator,deleteBlog)
Router.route("/blogs/blogdata/:id").get(authTokenValidator,blogData)
Router.route("/blogs/update/blogdata/:id").post(authTokenValidator,upload.single('img'),updateBlog)
Router.route("/blog/:id").get(authTokenValidator,getBlogbyID)
// using authMiddleware to know whether user has token or not || whether user is login or not 
Router.route("/userData").get(authTokenValidator,userData)
Router.route("/addLike/:id").post(authTokenValidator,addLike)
Router.route("/removeLike/:id").post(authTokenValidator,removeLike)
Router.route("/blog/addComment/:id").post(authTokenValidator,addComment)
//user dashboard
Router.route("/user/dashboard").get(authTokenValidator,userDashboard)
Router.route("/dashboard/userblogs").get(authTokenValidator,userBlogs)
Router.route("/dashboard/user/likedblogs").get(authTokenValidator,LikedBlogs)
Router.route("/dashboard/user/dislikedblogs").get(authTokenValidator,DisLikedBlogs)
//for uploading file in db and frontend

module.exports=Router
