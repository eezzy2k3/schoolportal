const mongoose = require("mongoose")

const studentschema =new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    profilePicture:{
        type:String
    },
    status:{
        type:String,
        enum:["Pending","Active"],
        default:"Pending"

    },
    matricNumber:{
        type:Number,
        required:true
    },
    profilePicture:{
        type:String
    },
    confirmationCode:{
        type:String
    }
},{timestamps:true})

const Student = new mongoose.model("Student",studentschema)
module.exports = Student