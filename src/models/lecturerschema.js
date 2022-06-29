const mongoose = require("mongoose")
const { required } = require("nodemon/lib/config")

const lecturerschema = new mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student" },
    studentRecord:[{
        course:{
            type:String,
            required:true
        },
        courseCode:{
            type:String,
            required:true
        },
        units:{
            type:Number,
            required:true
        },
        score:{
            type:Number,
            required:true
        },
        grade:{
            type:String,
            required:true
        },
        lecturer:{
            type:String
        },
    point:{
        type:Number
    }
    }],
    cgpa:{
        type:String
    }
},{timestamps:true})

const Lecturer =new mongoose.model("Lecturer",lecturerschema)

module.exports = Lecturer