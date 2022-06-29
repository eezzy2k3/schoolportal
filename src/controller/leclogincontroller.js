require("dotenv").config()
const Lecturerprofile = require("../models/lecturloginschema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createlecturer = async (req,res)=>{
    try{
        let {fullName,email,password} = req.body
        // check email if already exist
        const findone = await Lecturerprofile.findOne({email})
        if(findone) return res.status(400).json({success:false,msg:"Profile already created"})
        let hashedpassword = await bcrypt.hash(password,12)
        password = hashedpassword
        const confirmationCode = jwt.sign({email,fullName},process.env.LSECRET,{expiresIn:"40d"})
        const newlecturer = await new Lecturerprofile({fullName,email,password,confirmationCode})
        await newlecturer.save()
        return res.status(200).json({success:true,msg:"lecturer profile successfuly created",data:newlecturer})
    //     nodemailer.jsendConfirmationEmail(
    //         newstudent.firstName,
    //         newstudent.email,
    //         newstudent.confirmationCode
    //  );
    
    }catch(err){
        console.log(err)
        return res.status(404).json({
            success:false,
            msg:err.message
        })
    }
   
}

const loginLecturer = async(req,res)=>{
    try{
        const password = req.body.password
        const email = req.body.email
        const findlecturer = await Lecturerprofile.findOne({email})
        if(!findlecturer) return res.status(404).json({success:false,msg:"lecturer profile does not exist"})
        if(findlecturer.status!="Active") return res.status(404).json({success:false,msg:"Pending profile.verify your email"})
        const validlecturer = await bcrypt.compare(password,findlecturer.password)
        if(!validlecturer) return res.status(404).json({success:false,msg:"invalid matric number or password"})
        const accesstoken = jwt.sign({fullName:findlecturer.fullName},process.env.LSECRET,{expiresIn:"40d"})
        res.status(200).json({
            success:true,
            msg:"lecturer successfully logged in",
           accesstoken:accesstoken
        })
    }catch(error){
        console.log(error)
        return res.status(404).json({
            success:false,
            msg:error.message
        })
    }
   
}
// verify if email is valid
const verifymail = async(req,res)=>{
    try{
        const confirmationCode = req.params.confirmationCode
        const findlecturer = await Lecturerprofile.findOne({confirmationCode})
        if(!findlecturer) return res.status(400).json({success:false,msg:"Invalid confirmation code"})
        findlecturer.status="Active"
        findlecturer.save()
        res.status(200).json({success:true,msg:"email was successfully confirmed"})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
    }
   
}

module.exports = {createlecturer,loginLecturer,verifymail}
