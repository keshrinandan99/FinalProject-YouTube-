import {ApiResponse} from "../utils/ApiResponse.js";
import {videos} from "../models/videos.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//import { ApiResponse } from "../utils/ApiResponse.js";



const getAllVideo = asyncHandler(async (req, res) =>{
    const {page=1, limit=10, query, sortby,sortType,userID } = req.query;
    const pipeline = [];
    if(query){
        pipeline.push({
            $match: {
                $or:[
                    {
                        title: { $regex : query,}
                    },
                    {
                        description: { $regex: query }

                    }
                     
                ]
                
            }
});
}
    if(userID){
        pipeline.push({
            $match: {
                owner:userID
            }
        });
    }
if(sortby && sortType){
    pipeline.push({
        $sort:{
            [sortby]:sortType ==='asc'? -1:1
        }
    });
}
//pagination
pipeline.push({
    $skip:(Number(page)-1)*Number(limit)
});

pipeline.push({
    $limit:Number(limit)
});
const Video = await videos.aggregate(pipeline);
const totalVideos= await videos.countDocuments(
    query || userID ? pipeline[0]?. $match || {}:{}
);
return res.status(200)
.json(
    new ApiResponse(200,{
        videos: Video,
        currentPage:Number(page),
        totalPages:Math.ceil(totalVideos/Number(limit)),
        totalVideos
    },
    "Videos fetched successfully"
))  ;
})

const publishAVideo=asyncHandler(async(req,res)=>{
    const {title,description}=req.body;
    const videoFilePath=req.files?.path ;
    console.log(videoFilePath);
    
    if(!videoFilePath)
    {
        res.status(400);
        throw new ApiError(400,"Video file is required");
    }
    const newVideoUpload= await uploadOnCloudinary(videoFilePath);
    if(!newVideoUpload.url)
    {
        throw new ApiError(400,"Video file Upload Failed");
    }
const video = await videos.create({
    title,
    description,
    videoFile:newVideoUpload.url,
    owner:req.user._id,
    isPublished:true
})
const videoUpload= await videos.findById(video._id)
fs.unlinkSync(videoFilePath);
return res.status(201)
.json(
    new ApiResponse(201,
        videoUpload,
        "Video uploaded Successfully"
    )
);
})

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if(!videoId)
    {   
        throw new ApiError(400,"Video ID is required")
    }
    const video= await videos.findById(videoId);
    if(!video)
    {
        throw new ApiError(400, "Video not found !")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,
            {video},
            "Video details fetched Successfully"
        )
    )
})


export {getAllVideo,publishAVideo,getVideoById};