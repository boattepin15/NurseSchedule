const User = require('../model/User.js')
const date = new Date()
const daysInSeptember = require('./CountDay.js')
const Duty = require('../model/Duty.js')

// เป็นฟังก์ชัน สร้าง ตารางของ User ทั้งหมด
const CreateSchedule = async(req, res, year) => {
    try{
    
    const user = await User.find()
    for(let i = 0; i< user.length; i++ ){
        //เช็คว่ามีข้อมูลของ ตารางของปีนี้หรือยัง
       var uid = user[i]._id
       const check =  await Duty.findOne({
            _user:uid,
            year:year,
            month:date.getMonth() + 1
        })
        /// case ที่ไม่มี จะทำการสร้าง ตารางประจำปีขึ้นมา
        if(check === null){
            console.log();
            for(let m = 0;m < daysInSeptember; m++){
                //สร้างจำนวน Entity ตามจำนวนของเดือน
                const duty = await Duty.create({
                    _user:uid,
                    year:year,
                    month: date.getMonth() +1,
                    day:m+1,
                    group:"",
                    morning:0,
                    noon:0,
                    night:0,
                    count:0
                })

                console.log("User ",uid," create shift of month", duty.month, "day ",m + 1);
            }          
          
        }
    }

    }catch(error){
        console.log("Error function CreateSchedule", error);
    }
}



module.exports = CreateSchedule