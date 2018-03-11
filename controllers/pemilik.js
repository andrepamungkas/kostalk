const authHelper = require('../helpers/auth');
const models = require('../models');
const Pemilik = models.Pemilik;

async function daftar(req, res) {
    let name = req.body.nama;
    let email = req.body.email;
    let phone = req.body.noHp;
    let payload = {
        success: true,
        message: "Pendaftaran berhasil.",
    };
    let countOwner = await Pemilik.count({
        where: {email: email}
    });
    if (countOwner > 0) {
        payload.success = false;
        payload.message = "Email telah terdaftar.";
        res.status(409).json(payload);
        return;
    }
    let owner = await Pemilik.create({
        nama: name,
        email: email,
        noHp: phone
    });
    delete owner.dataValues.createdAt;
    delete owner.dataValues.updatedAt;
    payload.pemilik = owner;
    res.json(payload);
}

async function requestOtp(req, res) {
    let key = req.body.kunci;
    let payload = {
        success: true,
        message: "Kode berhasil dibuat.",
        otp:{}
    };
    let otp = await authHelper.requestCode(key);
    // todo : tambah pengiriman sms/email
    payload.otp.kunci = otp.dataValues.kunci;
    res.json(payload);
}

module.exports = {
    daftar,
    requestOtp
};