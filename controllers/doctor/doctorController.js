const imageModel = require('../../models/image');
const diagnosticModel = require('../../models/diagnostic');

exports.getIndex = async (req, res) => {
    return res.render('doctor/work');
}

async function checkValidDate(selected_date) {
    const date = new Date();
    const today = date.getDate();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    selected_date = selected_date.split('-')

    // Kiểm tra xem liệu người dùng đã đến ngày được cho phép làm tập ảnh này hay chưa
    if (currentYear < parseInt(selected_date[2])) return false;
    else if (currentMonth < parseInt(selected_date[1])) return false;
    else if (today < parseInt(selected_date[0])) return false;
    else return true;
}

async function getImagesByDate(doctor_id, selected_date) {
    let dia = await diagnosticModel.find({doctor_id:doctor_id, selected_date:selected_date}, "image_id -_id").populate('image_id');
    let i;
    let data = []
    for (i = 0; i < dia.length; i++) {
        data.push("images/endoscopic/" + dia[i].image_id.name);
    }

    return data;
}

async function calDistanceDate(dateA, dateB){
    dateA = dateA.split('-');
    dateA = new Date(dateA[2], dateA[1]-1, dateA[0])
    dateB = dateB.split('-');
    dateB = new Date(dateB[2], dateB[1]-1, dateB[0])

    // To calculate the time difference of two dates 
    var Difference_In_Time = dateA.getTime() - dateB.getTime(); 
    
    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

    return Difference_In_Days
}

async function getNearestDate(doctor_id){
    const date = new Date();
    const today = date.getDate();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    let currentDate = today + "-" + currentMonth + "-" + currentYear;

    let dia = await diagnosticModel.find({doctor_id:doctor_id}, "selected_date -_id").populate('image_id');
    let selected_dates = new Set()
    let i = 0;
    for (i = 0; i < dia.length; i++){
        selected_dates.add(dia[i].selected_date)
    }
    selected_dates = Array.from(selected_dates)
    max_selected_date = selected_dates[0];
    max_distance = await calDistanceDate(selected_dates[0], currentDate);
    
    for (i = 1; i < selected_dates.length; i++){
        let distance = await calDistanceDate(selected_dates[i], currentDate);
        if(distance <= 0 && distance > max_distance){
            max_distance = distance;
            max_selected_date = selected_dates[i];
        }
    }
    return max_selected_date;
}

exports.getImages = async (req, res) => {
    let nearestDate = await getNearestDate(req.user._id);
    let data = await getImagesByDate(req.user._id, nearestDate);

    return res.json({
        error: false,
        message: '',
        data: data
    });   
}

exports.getImagesByDate = async (req, res) => {
    let valid_date = await checkValidDate(req.query.selected_date);
    if(valid_date == false){
        return res.json({
            error: true,
            message: 'Chưa đến ngày thực hiện trên tập ảnh này, vui lòng quay lại sau!',
            data: []
        })
    }else{
        var data = await getImagesByDate(req.user._id, req.query.selected_date);
        return res.json({
            error: false,
            message: '',
            data: data
        });   
    }
}

exports.getSelectedDates = async (req, res) => {
    let selected_dates = await diagnosticModel.find({doctor_id: req.user._id}, 'selected_date -_id');
    var i = 0;
    var data = new Set();
    for(i = 0; i < selected_dates.length; i++){
       data.add(selected_dates[i].selected_date)
    }
    return res.json({
        error: false,
        message: "",
        data: Array.from(data)
    })
}

exports.saveDiagnostic = async (req, res) => {
    let img_type = req.body.img_type;
    let img_level = req.body.img_level;
    let selected_area = req.body.selected_area[0];
    let image_name = req.body.image;
    image_name = image_name.split(']')[1].substring(image_name.length, 1)
    console.log(image_name)
    let image = await imageModel.findOne({name:image_name});
    let image_id = image._id;

    diagnosticModel.findOneAndUpdate({doctor_id: req.user._id, image_id: image_id}, {
        selected_area:selected_area,
        img_type:img_type,
        img_level:img_level
    }, (err, dia) =>{
        if(err) console.log(err)
        else{
            return res.json({
                error: false,
                message: 'save successfully',
                data: []
            })
        }
    });
}

const logModel = require('../../models/log');

async function writeLog(log){
    let newLog = new logModel(log);
    newLog.save((err, newLog) => {
        if(err) console.log(err)
        else{
            return newLog;
        }
    })
}

exports.writeLog = async (req, res) => {
    let log = {
        doctor_id: req.user._id,
        action: req.body.action,
        image: req.body.image
    }
    let data = await writeLog(log)
    return res.json({
        error: false,
        message: '',
        data: data
    })
}