import mongoose ,{Schema} from 'mongoose';
import { users } from './users.models';
import { comments } from './comments.models';
const likes_Schema=  new Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:comments
    },
    createdAt:{
        type:Date
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:videos
    },
    updatedAt:{
        type:Date
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:tweets
    }
})
export const likes= mongoose.model("likes", likes_Schema);