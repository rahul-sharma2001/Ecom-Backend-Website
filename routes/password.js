const express = require('express');
const router = express.Router();
const {
    renderResetPasswordForm,
    resetPassword
} = require('../controllers/password')

router.post('/:token',resetPassword);
router.get('/:token',renderResetPasswordForm);

module.exports = router;
