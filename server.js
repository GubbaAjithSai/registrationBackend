const express=require("express");
const mongoose= require("mongoose");
const bcrypt=require("bcryptjs")
const hbs=require("hbs");
const cookieParser=require("cookie-parser");
const app=express();
const regSchema=require("./models/register")
const auth=require("./middleware/auth")
const dotenv=require("dotenv");
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

dotenv.config({path:'./config.env'});
hbs.registerPartials(__dirname+"/partials")

mongoose.connect(process.env.key).
then(()=>{
    console.log("db connected")
}).catch(err =>console.log(err));

app.use(express.static('public'));

app.set("view engine","hbs");

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/signin",(req,res)=>{
    res.render("signin");
})
app.get("/financials",auth,(req,res)=>{
    res.render("financials")
})

app.get("/logout",(req,res)=>{
    res.clearCookie("jwt");
    res.render("index");
})

app.post("/register",async(req,res)=>{
    try {
        const newData=new regSchema(await req.body)
        const data=await newData.save(); 
        res.render("index")
    }
    catch (error) {
        console.log(error)
    }
})

app.post("/signin",async(req,res)=>
{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const useremail=await regSchema.findOne({email:email});
        const isMatch=await bcrypt.compare(password,useremail.password);
        console.log(useremail,isMatch);
        const token=await useremail.generateAuthtoken();
        console.log(token);
        if(isMatch){
            console.log("entered");
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+60000),
                httpOnly:true
            });
            console.log("cookie sent");
            res.render("loggedIn")
        }else{
            res.send("incorrect password")
        }
    }catch (error) {
        res.send("invalid email")
    }
})

app.listen(3000,()=>
{
    console.log("server connected...");
}
)

