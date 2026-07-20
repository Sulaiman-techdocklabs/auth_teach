import Leave from "../models/leave.model.js";


export const getLeaves=async(req,res,next)=>{

    try{

        const leaves=await Leave.find({

            user:req.user._id

        }).sort({

            leaveDate:-1

        });

        res.status(200).json({

            success:true,

            count:leaves.length,

            data:leaves

        });

    }

    catch(error){

        next(error);

    }

};




export const applyLeave=async(req,res,next)=>{

    try{

        const{

            leaveType,

            reason,

            leaveDate

        }=req.body;

        const alreadyApplied=await Leave.findOne({

            user:req.user._id,

            leaveDate

        });

        if(alreadyApplied){

            return res.status(400).json({

                success:false,

                message:"Leave already applied for this date."

            });

        }

        const leave=await Leave.create({

            user:req.user._id,

            leaveType,

            reason,

            leaveDate

        });

        res.status(201).json({

            success:true,

            message:"Leave Applied Successfully.",

            data:leave

        });

    }

    catch(error){

        next(error);

    }

};