
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { users }from '../models/users.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import {upload} from '../middlewares/multer.middlewares.js';
import { response } from "express";

const generateAccessTokenAndRefreshToken = async(userID)=>{
    try{
        const user= await users.findone(userID);
        const accessToken= user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //now save it to the database
        user.refreshToken= refreshToken;
       await user.save({validationBeforeSave : false })

       return { accessToken, refreshToken};

    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token ");
    }
}



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


const coverImagePath = req.files && req.files.coverImage ? req.files.coverImage[0]?.path : null;



if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required ")
}
const avatar= await uploadOnCloudinary(avatarLocalPath);

    
    
    
const coverImage= await uploadOnCloudinary(coverImagePath);
    
    
    // if(!avatar){
    //     throw new ApiError(400,"Avatar file is required ")
    // }
     const newUser= await users.create({

        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverImage?.url || " ",
       
        
    })
    console.log("till here");
    

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
    if(!username || !email)
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

    const {accessToken, refreshToken}= await generateAccessTokenAndRefreshToken(users._id)

    const loggedInUser= await user.findById(users._id).select("-password -refreshToken")

    const options ={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken ", accessToken , options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                users: loggedInUser , accessToken, refreshToken
            }
        ),
        "User loggedIn successfull "

    )


})

const logoutUser=asyncHandler(async(req,res)=>{
    

})


export {registerUser, loginUser , logoutUser};