const jwt = require("jsonwebtoken")
require("dotenv").config()

const authorizeLecturer = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader||!authHeader.startsWith("Bearer")){
        return res.status(404).json({success:false,msg:"unauthorize user"})
    }
    const token = authHeader.split(" ")[1]
    let verified = jwt.verify(token,process.env.LSECRET)
    req.lecturer = verified
    next()

}

module.exports = authorizeLecturer