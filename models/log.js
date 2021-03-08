const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    image_id: {type: Schema.Types.ObjectId, ref: 'Image'},
    // Action: Next Image, Previous Image, Login, Logout, Click in img, Enter, Esc
    action: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Log', logSchema);