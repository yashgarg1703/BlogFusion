const {z}=require("zod");
const loginSchema=z.object({
    email:z
    .string({message:"Email is required"})
    .trim()
    .email({message:"Invalid email addresses"}),
    password:z
    .string({message:"Password is required"})
})

const signupSchema=z.object({
    username:z
    .string({message:"Name is required"})
    .min(3,{message:"Name should of atleast 3 characters"})
    .max(255,{message:"Name should be atmost 300  characters"}),
    email:z
    .string({message:"Email is required"})
    .trim()
    .email({message:"Invalid email addresses"})
    .min(3,{message:"Email should of atleast 3 characters"})
    .max(25,{message:"Email should be atmost 25  characters"}),
    phone:z
    .string({message:"PhoneNumber is required"})
    .min(10,{message:"PhoneNumber should be of 10 characters"})
    .max(10,{message:"PhoneNumber should be 10  characters"}),
     password:z
    .string({message:"Password is required"})
    .min(3,{message:"Password should be of atleast 3 characters"})
    .max(300,{message:"Password should be atmost 300  characters"}),

})

module.exports={signupSchema,loginSchema}