const Lecturer = require("../models/lecturerschema")



// create a student record
const createStudentRecord = async (req,res)=>{
    try{
        let {student,course,courseCode,units,score} = req.body
        const lecturer = req.lecturer.fullName
        let grade = ""
        if(score >= 70){
            grade = "A"
        } else if(score >=60) {
            grade = "B"
            
        } else if(score >= 50) {
            grade = "c"
        }else if(score>=45){
            grade = "D"
        }
        else if(score >= 40){
            grade = "E"
        }else{
            grade = "F"
        }
        let point = ""
        if(score >= 70){
            point = 5
        } else if(score >=60) {
            point = 4
            
        } else if(score >= 50) {
            point = 3
        }else if(score>=45){
            point = 2
        }
        else if(score >= 40){
            point = 1
        }else{
            point = 0
        }
        point = units*point
        const findstudent = await Lecturer.findOne({student}) 
        // if a record exist push in new record
        if(findstudent){
            findstudent.studentRecord.push({course,courseCode,units,score,grade,point,lecturer})
    
            const totalpointarray = findstudent.studentRecord.map((item)=>{
                return item.point
                
            })
            let totalPoint =0
            for (let i = 0; i < totalpointarray.length; i++) {
                totalPoint +=totalpointarray[i];
            }
            const totalunitarray = findstudent.studentRecord.map((item)=>{
                return item.units
                
            })
            let totalunit =0
            for (let i = 0; i < totalunitarray.length; i++) {
                totalunit +=totalunitarray[i];
            }
           
            const cgpa = totalPoint/totalunit
            findstudent.cgpa = cgpa.toFixed(3)
        
    
           
            
            await findstudent.save()
           return res.status(200).json({success:true,msg:"record successfully updated",data:findstudent})
    
        }
        // if no record create a new record
    const newRecord = await new Lecturer({student,studentRecord:[{course,courseCode,units,score,grade,point,lecturer}],
    cgpa:point/units})
     await newRecord.save()
     res.status(200).json({success:true,msg:"record successfully created",data:newRecord})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
    }
   
}
// student get their record
const getstudentrecord = async(req,res)=>{
    try{
        const {id,fullName} = req.student
        const findRecord = await Lecturer.findOne({student:id}).populate({path:"student",select:["firstName","lastName","matricNumber"]})
        if(!findRecord) return res.status(404).json({success:false,msg:`No record of student with id ${id}`})
        if(findRecord.studentRecord.length<0) return res.status(200).json({success:true,msg:`no record yet for ${fullName}`})
        return res.status(200).json({success:true,data:findRecord})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
    }
   
}
// update student record
const updateRecord = async(req,res)=>{
    try{
        const {courseCode,score,student} = req.body
        const lecturer = req.lecturer.fullName
        const findcourse = await Lecturer.findOne({student,courseCode})
        if(!findcourse) return res.status(400).json({success:false,msg:`student with id number ${student} not in the record`})
        const indexed = findcourse.studentRecord.findIndex((findcousr)=>findcousr.courseCode == courseCode)
        if(indexed<0) return res.status(400).json({success:false,msg:`course ${courseCode} not in the record`})
        const course = findcourse.studentRecord[indexed]
        if(course.lecturer!=lecturer) return res.status(200).json({success:false,msg:`${lecturer} you can only edit the course you uploaded`})

        course.score = score
        if(score >= 70){
           course.grade = "A"
        } else if(score >=60) {
            course.grade = "B"
            
        } else if(score >= 50) {
           course.grade = "c"
        }else if(score>=45){
           course.grade = "D"
        }
        else if(score >= 40){
            course.grade = "E"
        }else{
            course.grade = "F"
        }
        if(score >= 70){
            point = 5
        } else if(score >=60) {
            point = 4
            
        } else if(score >= 50) {
            point = 3
        }else if(score>=45){
            point = 2
        }
        else if(score >= 40){
            point = 1
        }else{
            point = 0
        }
        course.point =course.units*point
        const totalpointarray = findcourse.studentRecord.map((item)=>{
            return item.point
            
        })
        let totalPoint =0
        for (let i = 0; i < totalpointarray.length; i++) {
            totalPoint +=totalpointarray[i];
        }
        const totalunitarray = findcourse.studentRecord.map((item)=>{
            return item.units
            
        })
        let totalunit =0
        for (let i = 0; i < totalunitarray.length; i++) {
            totalunit +=totalunitarray[i];
        }
       
        const cgpa = totalPoint/totalunit
        findcourse.cgpa = cgpa.toFixed(3)
    
        await findcourse.save()
    
    
        res.status(200).json({success:true,msg:`${courseCode} successfully updated`,data:findcourse})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
        console.log(error)
    }
   
   
}
// remove a course
const removeCourse = async(req,res)=>{
    try{
        const {courseCode,student} = req.body
        const lecturer = req.lecturer.fullName
        const findcourse = await Lecturer.findOne({student})
        if(!findcourse) return res.status(400).json({success:false,msg:"invalid student ID"})
        const index =await findcourse.studentRecord.findIndex((course)=>course.courseCode==courseCode)
        if(index < 0)  return res.status(400).json({success:false,msg:`course ${courseCode} not in the record`})
        const course = await findcourse.studentRecord[index]
        if(course.lecturer!=lecturer) return res.status(200).json({success:false,msg:`${lecturer} you can only edit the course you uploaded`})
        findcourse.studentRecord.splice(index,1)
        const totalpointarray = findcourse.studentRecord.map((item)=>{
        return item.point
         })
        let totalPoint =0
        for (let i = 0; i < totalpointarray.length; i++) {
        totalPoint +=totalpointarray[i];
    }
    const totalunitarray = findcourse.studentRecord.map((item)=>{
        return item.units
        
    })
    let totalunit =0
    for (let i = 0; i < totalunitarray.length; i++) {
        totalunit +=totalunitarray[i];
    }
//    calculate cgpa
    const cgpa = totalPoint/totalunit
    findcourse.cgpa = cgpa.toFixed(3)

    await findcourse.save()
    res.status(200).json({success:true,msg:`${courseCode} successfully deleted`,data:findcourse})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
        console.log(error)
    }
   
}
// registered parent can check student record
const parentgetstudentrecord = async(req,res)=>{
    try{
        const student = req.params.student
        const findRecord = await Lecturer.findOne({student}).populate({path:"student",select:["firstName","lastName","matricNumber"]})
        if(!findRecord) return res.status(404).json({success:false,msg:`No record of student with id ${student}`})
        if(findRecord.studentRecord.length<0) return res.status(200).json({success:true,msg:`no record yet for student with matricnumber${matricNumber}`})
        return res.status(200).json({success:true,data:findRecord})
    }catch(error){
        res.status(404).json({success:false,msg:error.message})
    }
   
}



module.exports = {createStudentRecord,getstudentrecord,updateRecord,removeCourse,parentgetstudentrecord}