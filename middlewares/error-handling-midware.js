
const errorHandler=(err,req,res,next)=>{
      console.log("Error from error handler",err)
      const status=err.status || 500;
      const message=err.message || "Backend error";
      const errorDetails=err.errorDetails || "Error from Backend";
      // Ensure that the response is only sent once
  
      res.status(status).json({ message, errorDetails });
  
     next(err); // Call the default error handler if headers are already sent
}
module.exports=errorHandler