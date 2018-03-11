const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const pemilik = require('../../../controllers/pemilik');
const models = require('../../../models');
const Users = models.User;

router.post('/daftar', [
    check('nama').exists().withMessage('Nama tidak boleh kosong.'),
    check('email').isEmail().withMessage('Email tidak valid.'),
    check('noHp').exists().withMessage('Nomor HP tidak boleh kosong.')
        .isLength({min: 12, max: 16}).withMessage('Nomor HP tidak valid.')

], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let payload = {
            success: false,
            message: "Validasi error.",
            errors: errors.array()
        };
        return res.status(422).json(payload);
    }
    next();
}, pemilik.daftar);

router.post('/auth/otp', [
    check('kunci').exists().withMessage('Kunci tidak boleh kosong.')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let payload = {
            success: false,
            message: "Validasi error.",
            errors: errors.array()
        };
        return res.status(422).json(payload);
    }
    next();
}, pemilik.requestOtp);

module.exports = router;
