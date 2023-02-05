const User = require('../Models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Registration => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    const { name, email, password } = req.body;
    let result = {};
    if(req.body.avatar) {
        result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });
    } else {
        result.secure_url = 'https://res.cloudinary.com/dqs5qo3ts/image/upload/v1632225465/avatars/default_avatar_mc2qhu.jpg'
        result.public_id = 'avatars/default_avatar_mc2qhu'
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

   sendToken(user, 200, res);
});

//Login => /api/v1/login
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler('Please enter E-Mail and Password', 400))
    };

    const user = await User.findOne({ email: email }).select('+password');

    if(!user) {
        return next(new ErrorHandler('User does not exist with this E-Mail Address', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('This Users password does not match entered password.', 401));
    }

    sendToken(user, 200, res);
});

//Logout => /api/v1/logout
exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User is logged out.'
    })
});

//Forgot Password - Recover Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler('User not found with this E-Mail.', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //Create Reset Password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    const message = `Your password Token is as follows:\n\n${resetUrl}\n\nIf you have not requested a password reset then ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'E_Commerce Password Reset',
            message: message
        });
        res.status(200).json({
            success: true,
            message: `Reset token has been sent to ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password - Link from Mail => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    //Hash Token that we receive from req
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired.', 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match.', 400));
    }

    //Set up a new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});

//Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user: user
    });
});

//Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');

    //Check if previous password is correct
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched) {
        return next(new ErrorHandler('Old password is incorrect.', 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

//Update User Profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if(req.body.avatar !== '') {
        const user = await User.findById(req.user._id);
        const image_id = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(image_id);
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url 
        }
    }

    await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true
    });
});

//Admin Routes

//Get All Users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users: users
    });
});

//Get User Details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        user: user
    });
});

//Update User Profile by Admin => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true
    });
});

//Delete User => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 400));
    }

    // Remove avatar from cloudinary
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await User.findByIdAndRemove(req.params.id);

    res.status(200).json({
        success: true
    });
});