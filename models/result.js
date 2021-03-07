const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    doctor_id: {type: Schema.Types.ObjectId, ref: 'User'},
    image_id: {type: Schema.Types.ObjectId, ref: 'Image'},
    selected_date: String,
    selected_area_csv: String,
    selected_area_coco: String,
    selected_area_json: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Result', diagnosticSchema);