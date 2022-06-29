const jwt = require("jsonwebtoken")
require("dotenv").config()

const authorizeStudent = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader||!authHeader.startsWith("Bearer")){
        return res.status(404).json({success:false,msg:"unauthorize user"})
    }
    const token = authHeader.split(" ")[1]
    let verified = jwt.verify(token,process.env.SECRET)
    req.student = verified
    next()

}



module.exports = authorizeStudent