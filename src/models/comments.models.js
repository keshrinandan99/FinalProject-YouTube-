import mongoose , {Schema } from ' mongoose ';
import { users } from './users.models';
const comments_Schema=new Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    content :{
         type:String
    },
    createdAt:{
        type:String
    },
    updatedAt:{
        type:String
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:videos
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    }
})

export const comments= mongoose.model("comments", comments_Schema);