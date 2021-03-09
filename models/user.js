const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    info: {
        fullname: String,
        // lastname: String,
        gender: String,
        year_of_birth: String,
        phone: String,
        address: String,
        // location: String,

        company: String,
        experience_time: String,
        learning_endoscopic_time: String
    },
    local: { // Use local
        email: String,
        password: String,
        activeToken: String,
        activeExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    role: String, // ADMIN, DOCTOR
    status: String, // ACTIVE, INACTIVE, SUSPENDED.
}, {
    timestamps: true
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

// check role
userSchema.methods.isGroupAdmin = function(role){
    return role === 'ADMIN';
}

userSchema.methods.isInActivated = function(checkStatus){
    return checkStatus == "INACTIVE";
};

userSchema.methods.isSuspended = function(checkStatus){
    return checkStatus == "SUSPENDED";
};

module.exports = mongoose.model('User', userSchema);
