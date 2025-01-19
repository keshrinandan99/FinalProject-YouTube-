import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
const User_Schema=  new mongoose.Schema({
    id:{
        type:String,
        required:true

    },
    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"videos"
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
     

    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,

    },
    password:{
        type:String,
        required:[true, 'Password is required ']
        
    },
    refreshToken:{
        type:String,
        unique:true
    }
    // createdAt:{
    //     type:Dat
    // },
    // updatedAt:{
    //     type:Date
    // }


}, {timestamps:true});
User_Schema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10);
    next();

})
User_Schema.methods.isPasswordCorrect= async function (password){
     return await bcrypt.compare(password,this.password )
}


User_Schema.methods.generateAccessToken= async function(){
    
   try {
    const accessToken= await jwt.sign(
         {
            
            
            _id:this._id,
             email:this.email,
             username:this.username,
            fullName:this.fullname
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
         }
 
     )
     
    // console.log(accessToken);
     return accessToken;
     
     
 }
    catch (error) {
        console.error("new error", error);
        throw new ApiError(500, " Trouble generating Access Token ")
        
    
   }
}
User_Schema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )

}
export const users=mongoose.model("users", User_Schema);