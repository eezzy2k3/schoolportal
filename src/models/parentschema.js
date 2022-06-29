const { required } = require("joi");
const  mongoose  = require("mongoose");

const parentschema = new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Active"],
        default:"Pending"

    },
    confirmationCode:{
        type:String
    },
    otp:{
        type:String
    }
},{timestamps:true})

const Parent = new mongoose.model("Parent",parentschema)

module.exports = Parent

