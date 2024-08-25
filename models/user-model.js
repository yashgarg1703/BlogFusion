const mongoose=require('mongoose')
const jwt=require("jsonwebtoken")
const { boolean, object } = require('zod')
const userSchema=new mongoose.Schema({
    username:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    phone:
    {
        type:Number,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    isAdmin:
    {
        type:Boolean,
        default:false
    },
    liked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }],
    disliked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }
    ]
    },
    {timestamps:true}
)

//jwt token
userSchema.methods.generateToken=async function(){
       try{
        return jwt.sign(
            { //payload
                user_id:this._id.toString(),
                email:this.email,
                isAdmin:this.isAdmin
            },
                //signature
                process.env.JWT_SECRET_KEY,
            {
                expiresIn:"3d" //3 days
            }
            
        )   
       }
    catch(e)
    {
        console.log(e)
    }

}


const User = mongoose.model('User', userSchema) //User is collection now

module.exports=User