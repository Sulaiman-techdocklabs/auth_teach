import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
         type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        require:true,
        minlength:6,
        select:false,
        trim:true
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    authProvider:{
        type:String,
        enum:['local','google'],
        default:"local"
    },
    verificationToken:{
        type:String,
        select:false
    },
    
    resetPasswordToken:String,
    resetPasswordExpire:Date,
},
{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User=mongoose.model('User',userSchema);
export default User;
