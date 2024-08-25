const User=require("../models/user-model.js")
const Contact=require("../models/contact-model.js")
const Blog=require("../models/blog-model.js")
const bcrypt = require('bcrypt');
const UserData=require("../middlewares/authTokenValidator.js")
const fs=require('fs')
const path=require('path');
const { maxHeaderSize } = require("http");

////**** This is to make auth-route.js file more clean ****////
////**** This is basically refers to the actions performed when visiting to a particular route ****////

const home=async(req,res)=>{
    try
    {
        return res.status(200).send("This is Home Route using Express.js Router")
    }
    catch(error)
    {
        console.log(error)
       return res.status(404 || 400).send("Oops! An error has occured")
   
    }
}

const blogs=async(req,res)=>{
//    console.log("Blog")
    const category=req.params.category;
    // console.log(category)
    try{
        if(category==="all")
        {
            const response=await Blog.find();
            // console.log(response)
            if(!response)
                {
                    return res.status(400).send("Blogs not Found")
                }
            return res.status(200).send(response)
        }
        else
        {
            const response=await Blog.find({category:category});
            // console.log(response)
            if(!response)
                {
                    return res.status(400).send("Blogs not Found")
                }
            return res.status(200).send(response)
        }
        //   console.log("Response",response)
          

        // const {title,author,desc}=req.body;
        // console.log(req.body)
        // const BlogCreated=await Blog.create({title,author,desc});

        // return res.status(200).send({blogDetail:BlogCreated})
    }
    catch(error)
    {
       return res.status(400).send(`Error from Blog-> ${error}`)
    }
}
const getBlogbyID=async(req,res)=>{
    try{
        console.log("hello")
        const id=req.params.id;
        const response=await Blog.findById(id)
        console.log(response)
        return res.status(200).send({message:"nice",Blog:response})
    }
    catch(e)
    {
        console.log(e)
        
    }
}
const deleteBlog=async(req,res)=>{
    try{
        const id=req.params.id;
        await Blog.deleteOne({_id:id})
        return res.status(200).send({message:"Blog Deleted Successfully"})
    }
    catch(e)
    {
        next(e);
    }
    
    
}
const blogData=async(req,res)=>{
    try{
        const id=req.params.id;
        const {img,title,desc,category}=req.body;
        const response=await Blog.findOne({_id:id});
        if(response)
        {
            console.log("Blogdata fetch with success")
            const data={
                img:response.img.data,
                title:response.title,
                desc:response.desc,
                category:response.category
            }
            return res.status(200).json({meassge:"Blogdata fetch with success",data:data})
        }
        else
        {
            return res.status(400).json({meassge:"Unable to fetch Blogdata"})
        }
    }
    catch(e)
    {
        console.log(e);
    }
    
}
const updateBlog=async(req,res)=>{
    try{
        const id=req.params.id;
        const {title,desc,category}=req.body;
        if(req.file)
        {
            const imgURL=req.file;
            console.log('req.file:', imgURL); // Debug log
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            const response=await Blog.updateOne({_id:id},{
                img: {
                    data: imgURL.filename,
                    contentType: imgURL.mimetype
                },
                title:title,
                desc:desc,
                category:category})
            if(response)
            {
                // const res={
                //     img:{
                //         data:response.img.data,
                //         contentType: response.img.contentType
                //     },
                //     title:response.title,
                //     desc:response.desc,
                //     category:response.category
                // }
                return res.status(200).json({message:"Blog Updated With Success"})
            }
            else
            {
                return res.status(400).json({message:"Unable to Update Blog"})
            }
        }
        else if(!req.file)
        {
            const response=await Blog.updateOne({_id:id},{
                title:title,
                desc:desc,
                category:category})
            if(response)
            {
                // const res={
                //     img:{
                //         data:response.img.data,
                //         contentType: response.img.contentType
                //     },
                //     title:response.title,
                //     desc:response.desc,
                //     category:response.category
                // }
                return res.status(200).json({message:"Blog Updated With Success"})
            }
            else
            {
                return res.status(400).json({message:"Unable to Update Blog"})
            }
        }
       
        }
        catch(e)
        {
            console.log("Eroor",e);
        }
        
}
const register=async (req,res)=>{
    console.log("register start")
    try
    {
        const {username, email, phone, password}=req.body;
        // console.log(username,email,phone,password)

        const UserExist=await User.findOne({email:email})
        if(UserExist)
        {
            return res.status(400).json({message:"Email Already exits"})
        }

        
        
         //hash the password
        const saltRound=10
        // console.log(username,email,phone,password)
        const hashPassword=await bcrypt.hash(password, saltRound);
        // console.log(hashPassword)
        const UserCreated=await User.create({username,email,phone,password:hashPassword});

        return res.status(200).json({msg:UserCreated,token:await UserCreated.generateToken(),user_id:UserCreated._id.toString()})
        // console.log(UserCreated)

        
    }
    catch(error)
    {
        console.log("error from auth-controoler",error);
        // next(error)

      return res.status(400).send("Oops! An error has occured")
    //    console.log(error)
    }
}



const login=async(req,res)=>{

    try{
        //   res.status(200).send("Welcome to login page")
          
          const {email,password}=req.body
        //   console.log(email,password);

        const UserExist=await User.findOne({email})
        // console.log(UserExist)
        if(!UserExist)
        {
           return res.status(400).json({message:"Email does not exits"})
        }
        else
        {
            const user=await bcrypt.compare(password, UserExist.password)
            if(user)
            {
                
                return res.status(200).json(
                    {
                        message:"LogIn Success",
                        token:await UserExist.generateToken(),
                        user_id:UserExist._id.toString()
                    }
                )
            }
            else
            {
                return res.status(400).json({message:"Invalid Credentials"})
            }
        }

    }
    catch(e){
        console.log("error login"+e)
    }
}

const contact=async(req,res)=>{
    
    try{
        const data=req.body;
        const UserExist= await Contact.create(data);
        // console.log(UserExist);
       return res.status(200).json({message:"Your suggestion is successfully received.We will contact you soon."})
    }
    catch(e)
    {
        console.log(e);
    }
}

const createBlog=async(req,res)=>{
    try{
          const{title,desc,category}=req.body;
        //   console.log("category",category)
          const imgURL=req.file;
        //   console.log("createBlog labels",req.body)
        //   console.log("createBlog img",req.file)
          const blogCreated=await Blog.create({
            img: {
                data: imgURL.filename,
                contentType: imgURL.mimetype
            },
            title,
            author:req.userData.username,
            desc,
            category,
            email:req.userData.email
        })
          return res.status(200).send({blogCreated:blogCreated});
    }
    catch(e)
    {
        console.log("error from createblog",e)
    }
}
const myBlogs=async(req,res)=>{
    try{
        const email=req.userData.email
        const myBlogs=await Blog.find({email})
        if(myBlogs.length===0)
            {
                return res.status(200).send({message:"No Blogs Found"})
            }
        return res.status(200).send({myBlogs:myBlogs})
    }
    catch(e)
    {
        console.log(e)
    }
    
    
}
const userData=async(req,res)=>{
    // console.log("userData")
   try{
       const userDATA=req.userData;
       console.log(userDATA)
       return res.status(200).json(userDATA);
   }
   catch(e)
   {
    return res.status(400).json({msg:e})
   }
}
// adding likes
const addLike=async(req,res)=>{
    try{
         const blog_id=req.params.id;
         const user_id=req.userData._id;
         const io = req.io;
        //  console.log("addlike",blog_id,user_id)
         const user = await User.findById(user_id);
         const blog=await Blog.findById(blog_id)
        //  console.log("User Object:", user);  // Log the user object
 
         if (!user) {
             return res.status(404).json({ message: "User not found" });
         }
        // console.log(Array.isArray(user.liked))
        //  Ensure liked is an array
         if (!Array.isArray(user.liked)) {
             user.liked = [];
         }
         //  Ensure disliked is an array
         if (!Array.isArray(user.disliked)) {
            user.disliked = [];
        }
         if (!user.liked.includes(blog_id)) {
            if(user.disliked.includes(blog_id))
            {
            await User.updateOne({_id:user_id},{$pull:{disliked:blog_id}})
            blog.dislikes-=1;
            }
             user.liked.push(blog_id);
             blog.likes+=1;
             await user.save();
             await blog.save();
            //  io.emit('likeUpdated', { blog_id, likes: blog.likes.length, dislikes: blog.dislikes.length });
             return res.status(200).json({ message: "Blog liked successfully",likes:blog.likes,dislikes:blog.dislikes});
         } else {

            await User.updateOne({_id:user_id},{$pull:{liked:blog_id}})
            blog.likes-=1;
            await user.save();
            await blog.save();
            // io.emit('likeUpdated', { blog_id, likes: blog.likes.length, dislikes: blog.dislikes.length });
            return res.status(201).json({ message: "Already liked",likes:blog.likes,dislikes:blog.dislikes });
         }
         
     } catch (e) {
         console.error("Error:", e);
         return res.status(500).json({ message: "Internal server error To Like" });
     }
}
//removing dislikes
const removeLike=async(req,res)=>{
    try{
        const blog_id=req.params.id;
        const user_id=req.userData._id;
        const user=await User.findById(user_id);
        const blog=await Blog.findById(blog_id)
        const io = req.io;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!Array.isArray(user.disliked)) {
            user.disliked = [];
        }
        if(!user.disliked.includes(blog_id))
        {
            if(user.liked.includes(blog_id))
            {
            await User.updateOne({_id:user_id},{$pull:{liked:blog_id}})
            blog.likes-=1;
            }
            user.disliked.push(blog_id);
            blog.dislikes+=1;
            await user.save();
            await blog.save();
            // io.emit('dislikeUpdated', { blog_id, likes: blog.likes.length, dislikes: blog.dislikes.length });
            return res.status(200).json({message:"Disliked Successfully",likes:blog.likes,dislikes:blog.dislikes})
        }
        else
        {
            await User.updateOne({_id:user_id},{$pull:{disliked:blog_id}})
            blog.dislikes-=1;
            await user.save();
            await blog.save();
            // io.emit('dislikeUpdated', { blog_id, likes: blog.likes.length, dislikes: blog.dislikes.length });
            return res.status(201).json({message:"Already Disliked",likes:blog.likes,dislikes:blog.dislikes})
        }
    }
   catch(e){
    console.error("Error:", e);
    return res.status(500).json({ message: "Internal server error To Dislike" });
   }
}

const addComment = async (req, res) => {
    try {
        const blog_id = req.params.id;
        const { comment, user } = req.body;
        // const io = req.io;
        // Ensure comment and user are not empty
        if (!comment || !user || !user.username) {
            return res.status(400).json({ message: "Comment or user data missing" });
        }

        // Log incoming data
        // console.log("Received comment:", comment);
        // console.log("Received user:", user);

        // Create the comment object
        const commentObj = {
            text: comment,
            created:Date.now(),
            postedBy: user.username
        };

        // Log constructed comment object
        // console.log("Constructed commentObj:", commentObj);

        // Find and update the blog
        const blog = await Blog.findByIdAndUpdate(
            blog_id,
            { $push: { comments: commentObj } },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        // io.emit('commentAdded', { blog_id, comment: commentObj });
        // console.log("Updated blog with comment:", blog);
        return res.status(200).json({ message: "Comment Added Successfully", comments: blog.comments });
    } catch (e) {
        console.log("Comment error", e);
        return res.status(400).json({ message: "Internal Server Error To Add Comment" });
    }
};
// User Dashboard
const userDashboard=async(req,res)=>{
    try{
        const email=req.userData.email;
        //counting total blog posted by a certain user
        const total_post=await Blog.countDocuments({email:email})
        if(total_post===0)
        {
            return res.status(200).json({total_post:0,total_likes:0,total_dislikes:0,total_comments:0,category:[],recent_blogs:[]})
        }
        //count total likes on the posts of a specific user
        let total_likes=0,total_comments=0,total_dislikes=0;
        if(total_post!=0)
        {
             total_likes=await Blog.aggregate([
                { $match: { email: email } },
                { $group: { _id: "$email", tot_likes: { $sum: "$likes" } } }
              ])
            total_likes=0 || total_likes[0].tot_likes;
             //count total dislikes on the posts of a specific user

        total_dislikes=await Blog.aggregate([
            { $match: { email: email } },
            { $group: { _id: "$email", tot_dislikes: { $sum: "$dislikes" } } }
          ])
        total_dislikes=0||total_dislikes[0].tot_dislikes;
        //count total comments on the blogs posted by the user
         total_comments = await Blog.aggregate([
            { $match: { email: email } },
            { $unwind: "$comments" }, // to destruct(splits) the array of comments
            { $group: { _id: "$email", tot_comments: { $sum: 1 } } }
          ]);
          
          total_comments = total_comments.length > 0 ? total_comments[0].tot_comments : 0;
          // { $sum: 1 } increments the count by 1 for each document.
          //working of unwind
          //Example:
        //   {
        //     "_id": "1",
        //     "email": "abc@gmail.com",
        //     "comments": ["comment1", "comment2"]
        //   }
        // How unwind works....
        // {
        //     "_id": "1",
        //     "email": "abc@gmail.com",
        //     "comments": "comment1"
        //   },
        //   {
        //     "_id": "1",
        //     "email": "abc@gmail.com",
        //     "comments": "comment2"
        //   }
        }
        else
        {
            total_likes=0;
            total_dislikes=0;
            total_comments=0;
        }
        
       

        //calculating total blogs of each category
        const total_blogs=await Blog.aggregate([
            { $match: { email: email } },
            {
            $group:
            {_id:"$category",
                tot_blogs:
                {"$sum":1}}
        },{
            $sort:{_id:1}
        }])
        // console.log(total_blogs.length)
        
         // to find all categories from total_blogs array
        const Education = total_blogs.find(blog => blog._id === "Education")?total_blogs.find(blog => blog._id === "Education").tot_blogs:0;
        const Technology = total_blogs.find(blog => blog._id === "Technology")?total_blogs.find(blog => blog._id === "Technology").tot_blogs:0;
        const Travel = total_blogs.find(blog => blog._id === "Travel")?total_blogs.find(blog => blog._id === "Travel").tot_blogs:0;
        const Health = total_blogs.find(blog => blog._id === "Health")?total_blogs.find(blog => blog._id === "Health").tot_blogs:0;
        const LifeStyle = total_blogs.find(blog => blog._id === "LifeStyle")?total_blogs.find(blog => blog._id === "LifeStyle").tot_blogs:0;
        const Sports = total_blogs.find(blog => blog._id === "Sports")?total_blogs.find(blog => blog._id === "Sports").tot_blogs:0;
        const Business = total_blogs.find(blog => blog._id === "Business")?total_blogs.find(blog => blog._id === "Business").tot_blogs:0;
        const Others = total_blogs.find(blog => blog._id === "Others")?total_blogs.find(blog => blog._id === "Others").tot_blogs:0;
        const category={
            Education,
            Technology,
            Travel,
            Health,
            LifeStyle,
            Sports,
            Business,
            Others
        }
      //for fetching 6 recent blogs
      const recent_blogs=await Blog.find({email:email}).sort({published:-1}).limit(6);
    //   console.log(recent_blogs)
    return res.status(200).json({total_post,total_likes,total_dislikes,total_comments,category,recent_blogs})
    }
    catch(e)
    {
        console.log(e)
    }
     
}
const userBlogs=async(req,res)=>{
    try{
        const email=req.userData.email;
        const data=await Blog.find({email:email})
        return res.status(200).json({data})
    }
    catch(e)
    {
        console.log(e);
    }
}
const LikedBlogs=async(req,res)=>{
    try{
        // Find the user by userId and populate the liked blogs
        const id=req.userData._id;
        const user = await User.findById(id);

        if (!user) {
            console.log('User not found');
            return;
        }
        const liked_blogs=await Blog.find({_id:{$in:user.liked}});
        // Log the liked blogs
        // console.log('Liked blogs:', user.liked,user.username);
        return res.status(200).json({liked_blogs})
    }
    catch(e)
    {
        console.log(e);
    }
}
const DisLikedBlogs=async(req,res)=>{
    try{
        // Find the user by userId and populate the liked blogs
        const id=req.userData._id;
        const user = await User.findById(id);

        if (!user) {
            console.log('User not found');
            return;
        }
        const disliked_blogs=await Blog.find({_id:{$in:user.disliked}});
        // Log the liked blogs
        // console.log('Liked blogs:', user.liked,user.username);
        return res.status(200).json({disliked_blogs})
    }
    catch(e)
    {
        console.log(e);
    }
}
const homeRecentBlogs=async(req,res)=>{
    try{
        const response=await Blog.find().sort({published:-1}).limit(6)
        return res.status(200).send({data:response})
    }
    catch(e)
    {
        console.log(e)

    }
}

module.exports={home,blogs,register,login,contact,userData,createBlog,myBlogs,deleteBlog,updateBlog,blogData,getBlogbyID,addLike,removeLike,addComment,userDashboard,userBlogs,LikedBlogs,DisLikedBlogs,homeRecentBlogs} ///{home,register}-> treat home,register as an object not an function if {} are not in auth.router.js