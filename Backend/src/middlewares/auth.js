import { verifyToken } from "../services/token.service.js";
import User from "../models/user.model.js";
export const protect = async (req, res, next) =>{
    try{

        let token;
        if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
) {
    token = req.headers.authorization.split(" ")[1];
}
        
        if(!token){
            return res.status(401).json({success:false, message:"Not authorized no token"});
        }

        const decoded = verifyToken(token);
        if(!decoded){
            res.status(401).json({message:" invalid token"});
        }

const user= await User.findById(decoded.id);

  if(!user){
            res.status(401).json({message:" user not found"});
        }

        req.user=user;
next();
    }catch(error){
        res.status(401).json({message:"Not authorized"});
    }
}

export const verifyVerified =(req,res,next)=>{
    if(!req.user.isVerified ){
        res.status(403).json({message:"Account not verified"});
    }

    next();
}














