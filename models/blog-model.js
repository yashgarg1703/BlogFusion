const mongoose=require('mongoose')
const userData=require("../middlewares/authTokenValidator")

const getCurrentDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
// const getUserData=(req,res)=>{
//   const email=req.userData.email;
//   console.log(email)
// }
// console.log("Userdata",userData)
const blogSchema=new mongoose.Schema({
  img:{
    data: String,
    contentType: String
  },
  title:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  published:{
    type:Date,
    required:true,
    default:Date.now()
  },
  desc:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  likes:{
    type:Number,
    default:0
  },
  dislikes:{
    type:Number,
    default:0
  },
  comments:[{
    text:String,
    created:{
      type:Date
    },
    postedBy:{
      type:String,
    }
  }],
  category:{
    type:String
  }

},
{timestamps:true}
)

const Blog=mongoose.model('Blog',blogSchema)
module.exports=Blog