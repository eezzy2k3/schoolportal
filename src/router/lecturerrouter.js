const {createStudentRecord,getstudentrecord,updateRecord,removeCourse,parentgetstudentrecord} = require("../controller/lecturercontroller")
const authorizeStudent = require("../middlewares/authstudent")
const authorizeLecturer = require("../middlewares/authlect")
const authorizeParent = require("../middlewares/authparent")
const express = require("express")
const router = express.Router()


router.post("/createrecord",authorizeLecturer,createStudentRecord)
router.put("/updaterecord",authorizeLecturer,updateRecord)
router.get("/getstudentrecord",authorizeStudent,getstudentrecord)
router.get("/parentgetstudentrecord/:student",authorizeParent,parentgetstudentrecord)
router.delete("/removecourse",authorizeLecturer,removeCourse)


module.exports = router