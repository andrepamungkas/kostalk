const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const pemilik = require('../../../controllers/pemilik');
const models = require('../../../models');

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

router.post('/auth/verifikasi', [
    check('kunci').exists().withMessage('Kunci tidak boleh kosong.'),
    check('kode').exists().withMessage('Kode tidak boleh kosong.')
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
}, pemilik.verifyOtp);

router.post('/:ownerId/anggota', [
    check('nama').exists().withMessage('Nama tidak boleh kosong.'),
    check('noHp').exists().withMessage('Nomor HP tidak boleh kosong.'),
    check('biaya').isNumeric({min: 0}).withMessage('Biaya harus bernilai integer.'),
    check('interval').isInt({min: 1}).withMessage('Interval tidak boleh kurang dari 1.'),
    check('tanggal_mulai').exists().withMessage('Tanggal mulai tidak boleh kosong.')
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
}, pemilik.addMember);

router.get('/:ownerId/anggota', pemilik.getMembers);

router.get('/test', async (req, res) => {
    res.json({hell: 'yee'})
});

router.get('/:ownerId', pemilik.getOwner);

router.put('/:ownerId',  [
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
},  pemilik.updateOwner);

router.put('/:ownerId/anggota/:memberId',[
    check('nama').exists().withMessage('Nama tidak boleh kosong.'),
    check('noHp').exists().withMessage('Nomor HP tidak boleh kosong.'),
    check('biaya').isNumeric({min: 0}).withMessage('Biaya harus bernilai integer.'),
    check('interval').isInt({min: 1}).withMessage('Interval tidak boleh kurang dari 1.'),
    check('tanggal_mulai').exists().withMessage('Tanggal mulai tidak boleh kosong.')

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
},pemilik.updateMember);

module.exports = router;
