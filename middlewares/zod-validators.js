const {signupSchema}=require("../validator/auth-validators")

const validate = (schema) => async (req, res, next) => {
    try {
    
       
      const parseBody = await schema.parseAsync(req.body);
        req.body= parseBody;
      next();
    } catch (err) {
      // console.log(err)
      // Extracting specific error messages from ZodError
      // const errorMessages = err.issues.map((issue) => issue.message);
      // console.log(errorMessages)
       const status=422;
       const message="Fill The Input Properly";
       const errorDetails=err.errors[0].message;

       const error={
        status,
        message,
        errorDetails
       }
       console.log("msg from zod-validators",error);
      //  return res.status(status).json({ message, errorDetails });
       next(error);
    }
  };

  module.exports=validate;