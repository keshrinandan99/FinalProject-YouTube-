import mongoose , {Schema} from 'mongoose'
import { users, Users } from './users.models'
const videos_Schema= new Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    videoFile:{
        type:String,
        required:true

    },
    thumbnail:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String

    },
    duration :{
        type:Number
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean
    },
    // createdAt:{
    //     type:Date
    // },
    // updatedAt:{
    //     type:Date
    // }
},{timestamps:true})


 

const videos=mongoose.mondel("videos", videos_Schema);