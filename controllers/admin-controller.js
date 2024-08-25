const User=require("../models/user-model.js")
const Contact=require("../models/contact-model.js")


//ADMIN PANEL
// to get all Registered Users 
const getAllUsers=async(req,res)=>{
    try{
        const response=await User.find().select({password:0});
        if(!response)
            {
                return res.status(404).send({message:"Not able to fetch User Data"})
            }
            console.log("userData is fetch successfully from backend");
            return res.status(200).send({userData:response})
    }
    catch(e)
    {
        next(e);
    }
    
        
}
//to delete user
const deleteUser=async(req,res)=>{
  try{
      const id=req.params.id;//params fetch data from url
      await User.deleteOne({_id:id})
      return res.status(200).send("User deleted succesfully");
  }
  catch(e)
  {
    next(e);
  }
}
// to get all Contact data
const getAllContactData=async(req,res)=>{
    try{
        const response=await Contact.find();
        if(!response)
            {
                return res.status(404).send({message:"Not able to fetch User Data"})
            }
            console.log("userContact is fetch successfully from backend");
            return res.status(200).send({userContact:response})
    }
    catch(e)
    {
        next(e);
    }        
}
//delete the contact
const deleteContact=async(req,res)=>{
    try{
        const id=req.params.id;
        await Contact.deleteOne({_id:id})
        return res.status(200).send("Contact Delete Succefully")
    }
    catch(e)
    {
        next(e);
    }
    
}
const userData=async(req,res)=>{
    try{
        const id=req.params.id;
    const response=await User.findOne({_id:id});
    if(response)
    {
        
        const data={
          username:response.username,
          email:response.email,
          phone:response.phone
        }
        return res.status(200).send({message:"User fetch with Success",userdata:data});
    }
    else
    {
        return res.status(400).json({message:"Unable To Fetch User Data"});
    }
    }
    catch(e)
    {
        console.log(e);
    }
}
const updateUser=async(req,res)=>{
    try{
        const id=req.params.id;
        const {username,email,phone}=req.body;
        const response=await User.updateOne({_id:id},{username:username,email:email,phone:phone})
        if(response)
        {
            return res.status(200).json({message:"User Updated with Success",response:response});
        }
        else
        {
            return res.status(400).json({message:"Error in Updating User"});
        }
    
    }
    catch(e)
    {
        console.log(e);
    }
    

}
module.exports={getAllUsers,getAllContactData,deleteUser,deleteContact,userData,updateUser}