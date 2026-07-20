import Attendance from "../models/attendance.model.js";

/*
---------------------------------------------------
GET Attendance History
GET /api/attendance
---------------------------------------------------
*/
export const getAttendance = async (req, res, next) => {
    try {

        const attendance = await Attendance.find({
            user: req.user._id
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });

    } catch (error) {
        next(error);
    }
};


/*
---------------------------------------------------
Punch In
POST /api/attendance/punch-in
---------------------------------------------------
*/
export const punchIn = async (req, res, next) => {

    try {

        const today = new Date();
        today.setHours(0,0,0,0);

        const alreadyExists = await Attendance.findOne({
            user: req.user._id,
            date: today
        });

        if(alreadyExists){

            return res.status(400).json({
                success:false,
                message:"You have already punched in today."
            });

        }

        const attendance = await Attendance.create({

            user:req.user._id,

            date:today,

            punchIn:new Date()

        });

        res.status(201).json({

            success:true,

            message:"Punch In Successful.",

            data:attendance

        });

    } catch (error) {

        next(error);

    }

};


/*
---------------------------------------------------
Punch Out
POST /api/attendance/punch-out
---------------------------------------------------
*/
export const punchOut = async (req,res,next)=>{

    try{

        const today=new Date();

        today.setHours(0,0,0,0);

        const attendance=await Attendance.findOne({

            user:req.user._id,

            date:today

        });

        if(!attendance){

            return res.status(404).json({

                success:false,

                message:"Please Punch In first."

            });

        }

        if(attendance.punchOut){

            return res.status(400).json({

                success:false,

                message:"Already Punched Out."

            });

        }

        attendance.punchOut=new Date();

        const totalMilliseconds=attendance.punchOut-attendance.punchIn;

        const totalHours=totalMilliseconds/(1000*60*60);

        attendance.totalHours=Number(totalHours.toFixed(2));

        if(totalHours>=8.5){

            attendance.status="Full Day";

        }

        else if(totalHours>=4.5){

            attendance.status="Half Day";

        }

        else{

            attendance.status="Absent";

        }

        await attendance.save();

        res.status(200).json({

            success:true,

            message:"Punch Out Successful.",

            data:attendance

        });

    }

    catch(error){

        next(error);

    }

};