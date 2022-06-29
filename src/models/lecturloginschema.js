const mongoose = require("mongoose")

const lectloginschema = new mongoose.Schema({
   fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
     status:{
        type:String,
        enum:["Pending","Active"],
        default:"Pending"

    },
    confirmationCode:{
        type:String
    }
},{timestamps:true})

const Lecturerprofile = new mongoose.model("Lecturerprofile",lectloginschema)

module.exports = Lecturerprofile

