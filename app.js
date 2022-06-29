require("dotenv").config()
const express = require("express")
const connectDb = require("./config/config")
const studentrouter = require("./src/router/studentrouter")
const lecturerrouter = require("./src/router/lecturerrouter")
const lecturerloginrouter = require("./src/router/lectlogin")
const parentrouter = require("./src/router/parentroute")


const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
connectDb()

app.use("/api",studentrouter)
app.use("/api",lecturerrouter)
app.use("/api",lecturerloginrouter)
app.use("/api",parentrouter)








app.listen(process.env.PORT,()=>{
    console.log("app is listening on port 3000....")
})