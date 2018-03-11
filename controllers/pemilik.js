const models = require('../models');
var Pemilik = models.Pemilik;

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
    payload.pemilik = owner;
    res.json(payload);
}

module.exports = {
    daftar
};