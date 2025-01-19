import mongoose, {Schema} from 'mongoose '
import { users } from './users.models';

const tweet_schema= new Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    content:{
        type:String

    },
    createdAt:{
        type:Date
    },
    updatedAt:{
        type:Date
    }
})

const tweets=mongoose.model("tweets", tweet_schema);