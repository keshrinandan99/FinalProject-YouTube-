import mongoose ,{Schema} from 'mongoose '
import { users } from './users.models'
const playlists_Schema= new Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    name:{
        type:String,
        required:true,    

    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date
    }, 
    updatedAt:{
        type:Date
    },
    videos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:videos
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    }
})

const playlist= mongoose.model("playlists", playlists_Schema);