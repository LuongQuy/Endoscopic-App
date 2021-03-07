const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: String,
    type: String,
    mode: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);