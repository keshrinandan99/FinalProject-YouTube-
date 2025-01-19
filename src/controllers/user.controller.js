
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { users }from '../models/users.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import {upload} from '../middlewares/multer.middlewares.js';
import { response } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import mongoose  from "mongoose";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'


const generateAccessTokenAndRefreshToken = async(userID)=>{
    try{
        
        
        const user= await users.findById(userID);
        if(!user){
            throw new ApiError(404,"User not found ")
        }
        const accessToken=  await user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //now save it to the database
        
        user.refreshToken= refreshToken;
        console.log("hi");
       await user.save({validateBeforeSave : false })
       console.log("hi");
      
       

       return { accessToken, refreshToken};

    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token ");
    }
};



const registerUser= asyncHandler(async(req,res)=>{
    //get user details from frontend
    //validation-- check non empty
    //check if user already exists: username ,email 
    //check for images, check for avatar
    //upload images and avatar to cloudinary 
    //create user object -create entry in db 
    // remove password and refresh token field from response 
    //check for user creation 
    //return res

    const {fullname,email,username,password}=req.body
    
     
    if([fullname,email,username,password].some((field)=>
        field?.trim()==="")
    )
    {
        throw new ApiError(400,"All field are required")
    }
    
    const existedUser= await users.findOne({
        $or:[{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409,"username or email already exists")
    }
    

  

const avatarLocalPath = req.files?.avatar[0]?.path; // If using .array() or .fields()
console.log(avatarLocalPath);

const coverImagePath = req.files && req.files.coverImage ? req.files.coverImage[0]?.path : null;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required ")
}
const avatar= await uploadOnCloudinary(avatarLocalPath); 
const coverImage= await uploadOnCloudinary(coverImagePath);
    console.log(avatar.url , coverImage.url);
    
    
    // if(!avatar){
    //     throw new ApiError(400,"Avatar file is required ")
    // }
   console.log("till here");
   
     const newUser= await users.create({

        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverImage?.url || " " 
    })
    console.log(newUser);
    
    

    const createdUser= await users.findById(newUser._id).select(" -password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registed successfully")
    )

 
})


const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body;
    if(!(username || email))
    {
        throw new ApiError(400,"username or email is required");
    }
    const User= await users.findOne({
        $or:[{email}, {username}]
    })

    if(!User)
    {
        throw new ApiError(404," username or email does not exist ");
    }

    const isPasswordValid=await User.isPasswordCorrect(password);
    if(isPasswordValid)
    {
        throw new ApiError(401," Password is invalid");
        
    }


    const {accessToken, refreshToken}= await generateAccessTokenAndRefreshToken(User._id)

    const loggedInUser= await users.findById(User._id).select("-password -refreshToken")  
    const options ={
        httpOnly:true,
        secure:true
    }
    console.log("hifhaks");
    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                User: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfull "
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await users.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200 , " User logged Out"))
})

const refreshToken=asyncHandler(async(req,res)=>{
try {
        const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
        console.log(incomingRefreshToken);
        
        if(!incomingRefreshToken)
        {
            throw new ApiError(401,"Unauthorized access")
        }
       const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
       console.log("decoded : " ,decodedToken);
       console.log("after");
       
       
       const user=await users.findById(decodedToken?._id) ;
       console.log("user",user);
       
       if(!user)
       {
        throw new ApiError(401, 'Invalid refresh token ')
       }
       if(incomingRefreshToken != user?.refreshToken)
       {
        throw new ApiError(401, "Refresh token is expired or used")
       }
       const {accessToken, newrefreshToken}=await generateAccessTokenAndRefreshToken(user._id)
       const options={
        httpOnly:true,
        secure:true
       }
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newrefreshToken, options)
       .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newrefreshToken},
                "Access Token refreshed"
            )
       )
} catch (error) {
    throw new ApiError(401,  error?.message ||"Invalid refresh Token ")
}

})


export {registerUser, loginUser , logoutUser, refreshToken};