require("dotenv").config()
const mongoose = require("mongoose")

const connectDb = ()=>{
    mongoose.connect(process.env.PORT)
    console.log("connected to database")
}

module.exports=connectDb