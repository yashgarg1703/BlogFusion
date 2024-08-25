const jwt=require("jsonwebtoken")
const User=require("../models/user-model")

const authTokenValidator=async(req,res,next)=>
{
     const token=req.header("Authorization"); //not headers which we used in front end
    //   console.log(token)                                         //taking from postman->headers->Authorization
    // to remove "Bearer" keyword from token as it comes automatically
    const jwtToken=token.replace("Bearer","").trim();//trim removes extra space

        try
        {
            const isVerified=jwt.verify(jwtToken,process.env.JWT_SECRET_KEY)
            // console.log("yesssssssssss",isVerified); //gives details of logged user
            // you are fetching the user data which is stored in MongoDB db via register form
            const userdata=await User.findOne({email:isVerified.email})
            .select({password:0})
            req.userData=userdata;  //custom properties using request 
            // console.log(req.userData)
            // req.token=token;        //using request u can pass info between middleware functions
            // req.userID=userdata._id;
            next();
        }
        catch(e)
        {
            res.status(400).send({msg:"Invalid Token"})
        }
        
        


}



module.exports=authTokenValidator