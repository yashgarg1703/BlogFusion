const mongoose=require('mongoose')
const jwt=require("jsonwebtoken")
const contactSchema=new mongoose.Schema({
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
    message:{
        type:String,
        required:true
    }
})
const Contact = mongoose.model('Contact', contactSchema) //Contact is collection name
module.exports=Contact;