const {createlecturer,loginLecturer,verifymail} = require("../controller/leclogincontroller")
const express = require("express")
const router = express.Router()

router.post("/createlecturer",createlecturer)
router.post("/loginlecturer",loginLecturer)
router.get("/verifymaillecturer/:confirmationCode",verifymail)

module.exports = router
