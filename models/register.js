const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv");
dotenv.config({path:'../config.env'});
const regSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email already present"],
        validat(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid Email")
            }
        }
    },
    password:{
        type:String,
        required:true
    }
})

regSchema.methods.generateAuthtoken = async function () {
    try {
        const token=jwt.sign({_id:this._id.toString()},process.env.secretKey)
        return token;
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

regSchema.pre("save",async function(next){
    const passwordHash=await bcrypt.hash(this.password,10);
    this.password=passwordHash;
    next();
})

module.exports=mongoose.model("registrations",regSchema)