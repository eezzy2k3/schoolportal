const jwt = require("jsonwebtoken")
require("dotenv").config()

const authorizeParent = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader||!authHeader.startsWith("Bearer")){
        return res.status(404).json({success:false,msg:"unauthorize user"})
    }
    const token = authHeader.split(" ")[1]
    let verified = jwt.verify(token,process.env.PSECRET)
    req.student = verified
    next()

}



module.exports = authorizeParent