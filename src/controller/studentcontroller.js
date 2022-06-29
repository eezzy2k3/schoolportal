require("dotenv").config()
const Student = require("../models/studentschema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const cloudinary = require("../utils/cloudinary")
const { json } = require("express/lib/response")

const nodemailer = require('nodemailer')

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD
    }
 })

// create a new student profile
const createStudent = async (req,res)=>{
    try{
        let {firstName,lastName,email,phoneNumber,password} = req.body
        let matricNumber =  Math.floor((Math.random() * 1000000)+1 ) 
        const findmatric = await Student.findOne({matricNumber})
        // changes matric number if already exist
        if(findmatric){
            matricNumber =  Math.floor((Math.random() * 1000000)+1 )
        }
        const findone = await Student.findOne({email})
        if(findone) return res.status(400).json({success:false,msg:"Profile already created"})
        let hashedpassword = await bcrypt.hash(password,12)
        password = hashedpassword
        const confirmationCode = jwt.sign({email,matricNumber},process.env.SECRET,{expiresIn:"40d"})
        const newstudent = await new Student({firstName,lastName,email,phoneNumber,password,matricNumber,confirmationCode})
        await newstudent.save()
       
         const mailOptions = {
            from: process.env.MAIL, // Sender address
            to: `${newstudent.email}`, // List of recipients
            subject: 'confirmation mail', // Subject line
            html: `<h1>Email Confirmation</h1>
            <h2>Hello ${newstudent.firstName}</h2>
            <p>Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
            </div>`,
        };
        
        transport.sendMail(mailOptions, function(err, info) {
           if (err) {
             console.log(err)
           } else {
             console.log(info);
           }
        });

        return res.status(200).json({success:true,msg:"student profile successfuly created",data:newstudent})

    
    }catch(err){
        console.log(err)
        return res.status(404).json({
            success:false,
            msg:err.message
        })
    }
   
}

const loginStudent = async(req,res)=>{
    try{
        const password = req.body.password
        const matricNumber = req.body.matricNumber
        const findstudent = await Student.findOne({matricNumber})
        if(!findstudent) return res.status(404).json({success:false,msg:"Student profile does not exist"})
        if(findstudent.status!="Active") return res.status(404).json({success:false,msg:"Pending profile.verify your email"})
        const validStudent = await bcrypt.compare(password,findstudent.password)
        if(!validStudent) return res.status(404).json({success:false,msg:"invalid matric number or password"})
        const accesstoken = jwt.sign({matricNumber:findstudent.matricNumber,email:findstudent.email,id:findstudent._id},process.env.SECRET,{expiresIn:"40d"})
        res.status(200).json({
            success:true,
            msg:"student successfully logged in",
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

const getstudent = async (req,res)=>{
    try{
        const {matricNumber} = req.student 
        const findstudent = await Student.findOne({matricNumber})
        if(!findstudent)return res.status(404).json({success:false,msg:"invalid signature"})
        res.status(200).json({success:true,data:findstudent})
    } catch(error){
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
        const findstudent = await Student.findOne({confirmationCode})
        if(!findstudent) return res.status(400).json({success:false,msg:"Invalid confirmation code"})
        findstudent.status="Active"
        findstudent.save()
        res.status(200).json({success:true,msg:"email was successfully confirmed"})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
    }
   
}
// update student record
const updateStudent = async(req,res)=>{
    try{
        const {matricNumber} = req.student
        const updatedRecord = await Student.findOneAndUpdate({matricNumber},req.body,{new:true})
        if(!updatedRecord) return res.status(400).json({success:true,msg:"could not update record"})
        res.status(200).json({success:true,msg:"successfully updated data",data:updatedRecord})
    }catch(error){
        console.log(error)
        return res.status(404).json({
            success:false,
            msg:error.message
        })  
    }
   
}
// change user password
const changePassword = async(req,res)=>{
    try {
        let {password,newpassword} = req.body
        const {matricNumber} = req.student
        const user = await Student.findOne({matricNumber})
        if(!user) return res.status(404).json({success:false,msg:"invalid signature"})
        const validUser =await bcrypt.compare(password,user.password)
        if(!validUser) return res.status(404).json({success:false,msg:"invalid user name or password"})
        const hashedpassword =await bcrypt.hash(newpassword,12)
        user.password = hashedpassword
       await user.save()
        res.status(201).json({success:true,msg:"successfully changed password"})  
    } catch (error) {
        res.status(404).json({success:false,msg:error.message})  
    }
    
}

const uploadImage = async (req, res) => {

    const {matricNumber} = req.student
    
    const uploader = async (path) => await cloudinary.uploads(path , 'ProfilePicture')
    let url;
 
    const file = req.file

 
    const {path} = file
    const newPath = await uploader(path)
 
    url = newPath.url
 
    fs.unlinkSync(path)
              
 
    let user = await Student.findOne({matricNumber})
 
    user.profilePicture = url.toString()
 
    await user.save()
 
    res.status(200).json({
     success: true,
     msg: "successfully uploaded an image for the user",
     data: user
 })
 
 }
 
 




module.exports = {createStudent,loginStudent,getstudent,verifymail,updateStudent,changePassword,uploadImage}
