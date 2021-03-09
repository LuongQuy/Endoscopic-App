const path = require('path')
const imageModel = require('../models/image');
const fs = require('fs')

function create_img(imgPath, type, mode) {
    fs.readdir(imgPath, (err, files) => {
        if (err) console.log(err)
        files.forEach(file => {
            let image = new imageModel({
                name: file,
                type: type,
                mode: mode
            });
            image.save((err, result) => {
                if (err) console.log(err)
            })
        });
    });
}

exports.addImages = () => {
    create_img(path.join(__dirname, 'doctor/images/LCI/normal'), 'normal', 'LCI');
    create_img(path.join(__dirname, 'doctor/images/LCI/abnormal'), 'abnormal', 'LCI');

    create_img(path.join(__dirname, 'doctor/images/LCI_FAKE/normal'), 'normal', 'LCI_FAKE');
    create_img(path.join(__dirname, 'doctor/images/LCI_FAKE/abnormal'), 'abnormal', 'LCI_FAKE');

    create_img(path.join(__dirname, 'doctor/images/FICE/normal'), 'normal', 'FICE');
    create_img(path.join(__dirname, 'doctor/images/FICE/abnormal'), 'abnormal', 'FICE');

    create_img(path.join(__dirname, 'doctor/images/FICE_FAKE/normal'), 'normal', 'FICE_FAKE');
    create_img(path.join(__dirname, 'doctor/images/FICE_FAKE/abnormal'), 'abnormal', 'FICE_FAKE');

    create_img(path.join(__dirname, 'doctor/images/WLI/normal'), 'normal', 'WLI');
    create_img(path.join(__dirname, 'doctor/images/WLI/abnormal'), 'abnormal', 'WLI');

    return {
        error: false,
        message: '',
        data: []
    };
}