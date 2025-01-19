import mongoose from 'mongoose ';
import { users } from './users.models';
const subscription_Schema= new mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:users
    },
    createdAt:{
        type:Date
    },
    updatedAt:{
        type:Date

    }




})
export const subscription = mongoose.model("subscription" ,subscription_Schema )