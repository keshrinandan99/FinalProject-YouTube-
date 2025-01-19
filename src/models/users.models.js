import mongoose from 'mongoose';
const User_Schema=  new mongoose.Schema({
    // id:{
    //     type:String,
    //     required:true

    // },
    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"videos"
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
     

    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,

    },
    password:{
        type:String,
        required:[true, 'Password is required ']
        
    },
    refreshToken:{
        type:String,
        unique:true
    }
    // createdAt:{
    //     type:Dat
    // },
    // updatedAt:{
    //     type:Date
    // }


}, {timestamps:true});
User_Schema.pre("save", async function (next){
    if(!this.isModified("passwords")) return next();
    this.passwords=bcrypt.hash(this.passwords,10);
    next();

})
User_Schema.methods.isPasswordCorrect= async function (passwords){
     return await bcrypt.compare(passwords,this.passwords )
}
User_Schema.methods.generateAccessToken= function(){
   return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY
        }

    )
    
}
User_Schema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this.id
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )

}
export const users=mongoose.model("users", User_Schema);