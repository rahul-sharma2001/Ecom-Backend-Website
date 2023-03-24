const jwt = require('jsonwebtoken');
const userModel = require('../model/user');
const UserService = require('../services/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
let userService = new UserService();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: '19ceusf036@ddu.ac.in',
        pass: 'jaan1234'
    }
});

const renderResetPasswordForm = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const sellerId = decoded.sellerId;
        const seller = await userModel.findById(sellerId);
        if (!seller || Date.now() >= decoded.exp * 1000) {
            res.json({ error: 'error' });
            return;
        }
        res.status(200).json({ msg: 'token and user is valid' });
    } catch (error) {
        console.error('Error rendering reset password form:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const sellerId = decoded.sellerId;
        const seller = await userModel.findById(sellerId);
        if (password == seller.password) {
            res.status(200).json({ status: false, message: 'password can not be same as previous password'});
            return;
        }
        if (!seller || Date.now() >= decoded.exp * 1000) {
            res.status(500).json({ status: false, message: 'unoutherized access...'});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        seller.password = hashedPassword;
        const updatedSeller = await userService.updateUser({ _id: sellerId }, seller, {
            new: true,
            runValidators: true
        });
        res.status(200).json({status: true, message: 'password updated successfully!' });

    } catch (error) {
        console.error('Error rendering reset password form:', error);
        res.status(500).json({ status: false, message: 'Server error'});
    }
}
const UpdateUserPassword = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const { oldPassword, newPassword } = req.body.data;
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res
                .status(404)
                .json({ status: false, message: `user not found` });
        } else {
            bcrypt.compare(oldPassword, user.password, async function (err, result) {
                if (err) {
                    res.status(500).json({ status: false, message: err });
                } else if (result) {
                    const newHashPassword = await bcrypt.hash(newPassword, 10);
                    const updatedUser = await userService.updateUser({ _id: userId }, { password: newHashPassword }, {
                        new: true,
                        runValidators: true
                    });
                    if (updatedUser) {
                        res.status(200).json({ status: true, message: 'password updated successfully!' });
                    } else {
                        res.status(404).json({ status: false, message: 'password not update' });
                    }
                } else {
                    res.status(500).json({ status: false, message: 'enter correct old password' });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
const sendMailToUser = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.findOne({ emailId: email});
        if (!user) {
            return res
                .status(404)
                .json({ status: false, message: `no user with this email id` });
        } else {
            const token = jwt.sign({ sellerId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const resetUrl = `http://localhost:3000/reset-password/${token}`;
            const mailOptions = {
                from: '19ceusf036@ddu.ac.in',
                to: email,
                subject: ' reset password',
                html: `<p>hii ${user.firstName} ,</p><br><p>Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
            };
            await transporter.sendMail(mailOptions);
            res.status(200).json({ status: true, message: 'A verification email has been sent to your email address' });
        }
    } catch (error) {

    }
}

module.exports = {
    renderResetPasswordForm,
    resetPassword,
    UpdateUserPassword,
    sendMailToUser
}