const mongoose=require('mongoose')
const URI=process.env.MONGODB_URI
const connectdb=async()=>{
    try{
      await mongoose.connect(URI,{
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        writeConcern: { w: 'majority' }
      })
      
      console.log("Connection Successful")
    }
    catch(error){
        console.log(error)
        process.exit(0)
    }
}

module.exports=connectdb
