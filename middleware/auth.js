const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config({path:'../config.env'});
const auth=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.secretKey);
        console.log(verifyUser,"reached");
        next();
    } catch (error) {
        res.send(error);
        console.log(error);
    }
}
module.exports=auth;