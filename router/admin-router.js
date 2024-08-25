const express=require('express')
const adminMiddleware = require('../middlewares/admin-middleware')
const Router=express.Router()
const {getAllUsers,getAllContactData,deleteUser,deleteContact,userData,updateUser}=require("../controllers/admin-controller")
const authTokenValidator = require('../middlewares/authTokenValidator')


Router.route("/users").get(authTokenValidator,adminMiddleware,getAllUsers)
Router.route("/users/delete/:id").delete(authTokenValidator,adminMiddleware,deleteUser)
// : in id is for dynamic(Dynamic Route Parameter) otherwise it is considered as static
Router.route("/contacts").get(authTokenValidator,adminMiddleware,getAllContactData)
Router.route("/contacts/delete/:id").delete(authTokenValidator,adminMiddleware,deleteContact)
Router.route("/edit/userData/:id").get(authTokenValidator,adminMiddleware,userData)
Router.route("/edit/userData/update/:id").post(authTokenValidator,adminMiddleware,updateUser)
module.exports=Router