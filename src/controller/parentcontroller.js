const Parent = require("../models/parentschema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createParent = async(req,res)=>{
    try{
        let {fullName,email,password} = req.body
        const checkemail = await Parent.findOne({email})
        if(checkemail) return res.status(404).json({success:false,msg:`user with ${email} already exist`})
        const hashedpassword =await bcrypt.hash(password,12)
        password = hashedpassword
        const confirmationCode = jwt.sign({email,fullName},process.env.LSECRET,{expiresIn:"40d"})
        const newparent = await new Parent({fullName,email,password,confirmationCode})
       await newparent.save()
       return res.status(200).json({success:true,msg:"Parent profile successfuly created",data:newparent})
    }catch(error){
        console.log(error)
        res.status(404).json({success:false,msg:error.message})
    }
   


}
// verify if email is valid
const verifymail = async(req,res)=>{
    try{
        const confirmationCode = req.params.confirmationCode
        const findparent = await Parent.findOne({confirmationCode})
        if(!findparent) return res.status(400).json({success:false,msg:"Invalid confirmation code"})
        findparent.status="Active"
        findparent.save()
        res.status(200).json({success:true,msg:"email was successfully confirmed"})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
    }
   
}

const loginParent = async(req,res)=>{
    try{
        const password = req.body.password
        const email = req.body.email
        const finduser = await Parent.findOne({email})
        if(!finduser) return res.status(404).json({success:false,msg:"lecturer profile does not exist"})
        if(finduser.status!="Active") return res.status(404).json({success:false,msg:"Pending profile.verify your email"})
        const validparent = await bcrypt.compare(password,finduser.password)
        if(!validparent) return res.status(404).json({success:false,msg:"invalid signature"})
        const accesstoken = jwt.sign({fullName:finduser.fullName,email:finduser.email},process.env.PSECRET,{expiresIn:"40d"})
        res.status(200).json({
            success:true,
            msg:"successfully logged in",
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
// generate otp for resetting password
const generateotp =async (req,res)=>{
    try{
        const {email} = req.body
        const user = await Parent.findOne({email})
        if(!user) return res.status(404).json({success:false,msg:`user with ${email} does not exist`})
        const otp =  Math.floor((Math.random() * 1000000)+1 ) 
       user.otp = otp
       await user.save()
       res.status(200).json({success:true,msg:"otp sent to your mail",data:user.otp})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})  
    }
   
    
}
// reset password
const resetPassword = async(req,res)=>{
   try{
    const {otp,password} =req.body
    const user = await Parent.findOne({otp})
    if(!user) return res.status(200).json({success:false,msg:"invalid otp"})
    const hashedpassword =await bcrypt.hash(password,12)
    user.password = hashedpassword
    await user.save()
    res.status(200).json({success:true,msg:"password reset successful"})

   }catch(error){
    res.status(404).json({success:false,msg:error.message})  
   }
}


module.exports = {createParent,verifymail,loginParent,generateotp,resetPassword}



   
