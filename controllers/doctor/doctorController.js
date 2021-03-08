const path = require('path')
const imgFolder = path.join(__dirname, '../../public/images/demo')
const fs = require('fs');

const imageModel = require('../../models/image');
const diagnosticModel = require('../../models/diagnostic');

function create_img(imgPath, type, mode) {
    fs.readdir(imgPath, (err, files) => {
        if (err) console.log(err)
        files.forEach(file => {
            console.log(file);
            let image = new imageModel({
                name: file,
                type: type,
                mode: mode
            });
            image.save((err, result) => {
                if (err) console.log(err)
                else console.log(imgPath, '=> Done')
            })
        });
    });
}

exports.getIndex = async (req, res) => {
    return res.render('doctor/work');
}

exports.getWork = (req, res) => {
    return res.render('doctor/work')
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

async function getImages(doctor_id, selected_date) {
    console.log(selected_date)
    image_ids = await diagnosticModel.find({doctor_id:doctor_id, selected_date:selected_date}).populate('image_id')
    console.log(image_ids)
    images = await imageModel.find({selected_date:selected_date});
    data = [];
    numbers = Array.from(Array(images.length).keys())
    var num_img = 5;
    var i;
    var rand;
    for (i = 0; i < num_img; i++) {
        rand = Math.floor(Math.random() * numbers.length); // random index of index of images
        idx_img = numbers[rand];
        data.push("images/endoscopic/" + images[idx_img].name);
        numbers.splice(rand, 1);
    }

    return data.join("\n");
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
    console.log(data.length)
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

exports.add_image = (req, res) => {
    create_img(path.join(__dirname, 'images/LCI/normal'), 'normal', 'LCI');
    create_img(path.join(__dirname, 'images/LCI/abnormal'), 'abnormal', 'LCI');

    create_img(path.join(__dirname, 'images/LCI_FAKE/normal'), 'normal', 'LCI_FAKE');
    create_img(path.join(__dirname, 'images/LCI_FAKE/abnormal'), 'abnormal', 'LCI_FAKE');

    create_img(path.join(__dirname, 'images/FICE/normal'), 'normal', 'FICE');
    create_img(path.join(__dirname, 'images/FICE/abnormal'), 'abnormal', 'FICE');

    create_img(path.join(__dirname, 'images/FICE_FAKE/normal'), 'normal', 'FICE_FAKE');
    create_img(path.join(__dirname, 'images/FICE_FAKE/abnormal'), 'abnormal', 'FICE_FAKE');

    create_img(path.join(__dirname, 'images/WLI/normal'), 'normal', 'WLI');
    create_img(path.join(__dirname, 'images/WLI/abnormal'), 'abnormal', 'WLI');

    res.send('Done')
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

exports.saveSelectedArea = async (req, res) => {
    // console.log(req.body[0])
    // let selected_area = JSON.parse(req.body.selected_area[0]);
    let selected_area = req.body.selected_area[0];
    let image_name = req.body.image;
    image_name = image_name.substring(image_name.length, 4)
    console.log(image_name)
    let image = await imageModel.findOne({name:image_name});
    console.log(image)
    let image_id = image._id;

    diagnosticModel.findOneAndUpdate({doctor_id: req.user._id, image_id: image_id}, {selected_area:selected_area}, (err, dia) =>{
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