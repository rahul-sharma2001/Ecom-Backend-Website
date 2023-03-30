const express = require('express');
const router = express.Router();
const {
    renderResetPasswordForm,
    resetPassword,
    UpdateUserPassword,
    sendMailToUser
} = require('../controllers/password')

router.post('/forgotten-password/:email', sendMailToUser)
router.post('/:token',resetPassword);
router.patch('/:id',UpdateUserPassword);
router.get('/:token',renderResetPasswordForm);

module.exports = router;
