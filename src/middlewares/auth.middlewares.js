import { asyncHandler } from "../utils/AsyncHandler.js";
import { users }from '../models/users.models.js'
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'


   export const verifyJWT= asyncHandler(async(req, _,next)=>{
    try{   
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer", "")
        if(!token)
        {
            throw new ApiError(401, "Unauthorized access");
        }
        const decoded= jwt.verify( token ,ACCESS_TOKEN_SECRET );
        const user= await users.findById(decoded?._id).select('-password -refreshToken');
        if(!user)
        {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user=user;
        next();
    
} 
    catch (error) {
    throw new ApiError(401, error?.message ||  'Invalid access Token ')
    }
   })