const jwt = require('jsonwebtoken');
const userModel = require('../model/user');
const UserService = require('../services/user');
const bcrypt = require('bcrypt');
let userService = new UserService();

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
        if (!seller || Date.now() >= decoded.exp * 1000) {
            res.json({ error: 'error' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        seller.password = hashedPassword;
        const updatedSeller = await userService.updateUser({ _id: sellerId }, seller, {
            new: true,
            runValidators: true
        });
        res
            .status(200)
            .json({ msg: 'user updated successfully!' });
    
    } catch (error) {
        console.error('Error rendering reset password form:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    renderResetPasswordForm,
    resetPassword
}