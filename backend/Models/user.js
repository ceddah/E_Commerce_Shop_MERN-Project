const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.'],
        maxLength: [30, 'Your name must not exceed 30 characters.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your E-Mail.'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid E-Mail Address.']
    },
    password: {
        type: String,
        required: [true, 'Please enter password.'],
        minlength: [6, 'Your password must be at least 6 characters.'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

//Encyrpting password before saving User
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    } 

    this.password = await bcrypt.hash(this.password, 10);
});

//Returning JWT
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generate Password reset token
userSchema.methods.getResetPasswordToken = function() {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set token expire time to 30 minutes
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    
    return resetToken;
}

module.exports = mongoose.model('User', userSchema);