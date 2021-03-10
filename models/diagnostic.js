const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diagnosticSchema = new Schema({
    doctor_id: {type: Schema.Types.ObjectId, ref: 'User'},
    image_id: {type: Schema.Types.ObjectId, ref: 'Image'},
    img_type: String,
    img_level: Number,
    time: [{type: Date}],
    end_time: Date,
    diagnostic_area: String,
    diagnostic_file: String,
    diagnostic_type_time: Date,
    diagnostic_area_time: Date,
    selected_date: String,
    selected_area: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Diagnostic', diagnosticSchema);