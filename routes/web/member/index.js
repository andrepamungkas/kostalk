const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const member = require('../../../controllers/anggota');
const payment = require('../../../controllers/payment');
const xmlparser = require('express-xml-bodyparser');

router.get('/verifikasi', [
    check('userid').exists(),
    check('key').exists()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('/');
    }
    next();
}, member.getVerification);

router.post('/verifikasi', [
    check('name').exists(),
    check('phone').exists(),
    check('email').exists().isEmail()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('back');
    }
    next();
}, member.postVerification);

router.post('/pembayaran/cb', xmlparser({trim: false, explicitArray: false}), payment.callback);

module.exports = router;
