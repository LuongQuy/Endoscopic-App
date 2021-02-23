const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    private_key: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);