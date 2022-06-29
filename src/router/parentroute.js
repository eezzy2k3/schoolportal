const {createParent,verifymail,loginParent,generateotp, resetPassword} = require("../controller/parentcontroller")
const express = require("express")
const router = express.Router()

router.post("/createparent",createParent)
router.post("/loginparent",loginParent)
router.get("/verifymailparent/:confirmationCode",verifymail)
router.post("/generateotp",generateotp)
router.post("/resetpassword",resetPassword)

module.exports = router
