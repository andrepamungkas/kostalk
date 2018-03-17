const models = require('../models');
const Anggota = models.Anggota;
const Activation = models.Activation;

async function getVerification(req, res) {
    let memberId = req.query.userid;
    let token = req.query.key;
    let member = await Anggota.findById(memberId);
    let activation = await member.getActivation({where: {token: token}});
    if (!member || !activation) {
        return res.redirect('/');
    }
    res.render('verification', {name: member.nama, phone: member.noHp})
}

async function postVerification(req, res) {
    let memberId = req.query.userid;
    let member = await Anggota.findById(memberId);
    req.body.phone = member.noHp;
    await member.update({
        nama: req.body.name,
        email: req.body.email,
        status: true
    });
    Activation.destroy({where: {idAnggota: member.id}});
    res.render('message', {title: 'Sukses', description: 'Kakak telah berhasil verifikasi, tetaplah membayar kos tepat waktu.'})
}

module.exports = {
    getVerification,
    postVerification
};