// const jadwal = require('../helpers/job');
const models = require('../models');
const Anggota = models.Anggota;
const Activation = models.Activation;
const Ngekos = models.Ngekos;

async function getVerification(req, res) {
    let ngekosId = req.query.id;
    let token = req.query.key;
    let findNgekos = await Ngekos.findById(ngekosId);
    let activation = await findNgekos.getActivation({where: {token: token}});
    if (!findNgekos || !activation) {
        return res.redirect('/');
    }
    let member = await Anggota.findById(findNgekos.idAnggota);
    res.render('verification', {name: member.nama, phone: member.noHp})
}

async function postVerification(req, res) {
    let ngekosId = req.query.id;
    let findNgekos = await Ngekos.findById(ngekosId);
    if (!findNgekos) {
        return res.redirect('/');
    }
    let invoice = await findNgekos.getTagihans({
        attributes: ['jumlah', 'mulai', 'akhir', 'status'],
        order: [['akhir', 'DESC']]
    });
    if (!invoice) {
        return res.redirect('/');
    }
    let member = await Anggota.findById(findNgekos.idAnggota);

    // await jadwal.createJob(findNgekos.idPemilik + '.' + findNgekos.idAnggota, invoice[0].akhir, {idNgekos: findNgekos.id});
    req.body.phone = member.noHp;
    await member.update({
        nama: req.body.name,
        email: req.body.email,
        status: true
    });

    Activation.destroy({where: {idNgekos: ngekosId.id}});
    res.render('message', {
        title: 'Sukses',
        description: 'Kakak telah berhasil verifikasi, tetaplah membayar kos tepat waktu.'
    })
}

module.exports = {
    getVerification,
    postVerification
};