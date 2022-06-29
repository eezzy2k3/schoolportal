
const {createStudent,loginStudent,getstudent,verifymail,updateStudent,changePassword,uploadImage} = require("../controller/studentcontroller")
const authorizeStudent = require("../middlewares/authstudent")
const upload = require("../utils/upload")
const express = require("express")
const router = express.Router()

router.post("/createstudent",createStudent)
router.post("/loginstudent",loginStudent)
router.get("/getstudent",authorizeStudent, getstudent)
router.get("/verifymail/:confirmationCode",verifymail)
router.put("/updatestudent",authorizeStudent, updateStudent)
router.put("/changepassword",authorizeStudent, changePassword)
router.post('/uploadimage', authorizeStudent,upload.single('profilePicture'), uploadImage)




module.exports = router