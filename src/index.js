// import mongoose from 'mongoose'
// import { DB_NAME } from './src/constants'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
import {app} from './app.js'



dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{

    app.on('error',(error)=>{
        console.log(`error`,error);
        throw err;
    })
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log(`server listening on port ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log(`MONGODB CONNECTION ERR`);
    
})



//   import mongoose from 'mongoose';
//   import express from 'express';
//   import { DB_NAME } from './constants';
//   const app=express();

//   (async ()=>{
//    try{
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error", (error)=>{
//         console.log("ERR",error);
//         throw error
//     })
//     app.listen(process.env.PORT,()=>{
//         console.log(`app is listening on port: ${process.env.PORT}` )
//     })
    
//    }catch(error){
//     console.log("ERROR:", error)
//     throw err 
//    } 
//   })()