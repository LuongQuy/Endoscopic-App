const library = require('../library');
const userModel = require('../../models/user');

exports.getIndex = (req, res) => {
    res.render('admin/index', {username: library.getCurrentUser(req.user)});
}

exports.getSetting = (req, res) => {
    res.render('admin/setting', {user: req.user, username: library.getCurrentUser(req.user)});
}

exports.postSetting = (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        'local.password': req.body.password,
        'info.fullname': req.body.firstname
    }, (err, user) => {
        userModel.findById(req.user._id, (err, user) => {
            res.render('admin/setting', {user: user, updateProfileMessage: 'Cập nhật thông tin thành công', username: library.getCurrentUser(user)});
        });
    });
}