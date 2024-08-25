

const adminMiddleware=(req,res,next)=>{
    try{
        const isAdmin=req.userData.isAdmin;
        console.log(isAdmin)
        if(!isAdmin)
            {
                return res.status(403).send({message:"Access Denied!,Not an admin"})
            }
            
                 next();
            
    }
    catch(e)
    {
        next(e);
    }
   
}

module.exports=adminMiddleware