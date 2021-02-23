const path = require('path')
const imgFolder = path.join(__dirname, '../../public/images/demo')
const fs = require('fs');

const imageModel = require('../../models/image');

exports.getIndex = (req, res) => {
    return res.render('doctor/work');
}

exports.getWork = (req, res) => {
    return res.render('doctor/work')
}

exports.getImages = (req, res) => {
    imageModel.find().select("name -_id").where("random").limit(30).exec((err, results) => {
        if (err) console.log(err)
        else {
            console.log(results);
            res.json(results)
        }
    });
}

exports.add_image = (req, res) => {
    fs.readdir(imgFolder, (err, files) => {
        if (err) console.log(err)
        files.forEach(file => {
            console.log(file);
            let image = new imageModel({
                name: file
            });
            image.save((err, result) => { console.log('Done') })
        });
    });
    res.send('Done')
}