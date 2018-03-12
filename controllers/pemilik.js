const authHelper = require('../helpers/auth');
const commonHelper = require('../helpers/common');
const models = require('../models');
const Pemilik = models.Pemilik;
const Anggota = models.Anggota;
const Tagihan = models.Tagihan;
const Ngekos = models.Ngekos;

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
        otp: {}
    };
    let otp = await authHelper.requestCode(key);
    // todo : tambah pengiriman sms/email
    payload.otp.kunci = otp.dataValues.kunci;
    res.json(payload);
}

async function verifyOtp(req, res) {
    let key = req.body.kunci;
    let code = req.body.kode;
    let payload = {
        success: true,
        message: "Kode berhasil diverifikasi.",
    };
    // check otp
    let verifyOtp = await authHelper.verifyOtp(key, code);
    if (!verifyOtp) {
        payload.success = false;
        payload.message = "Kode salah.";
        res.status(401).json(payload);
        return;
    }
    // get data owner
    let owner;
    if (await commonHelper.isEmail(key)) {
        owner = await Pemilik.findOne({where: {email: key}});
    } else {
        owner = await Pemilik.findOne({where: {noHp: key}});
    }
    if (!owner) {
        payload.success = false;
        payload.message = "Pengguna tidak terdaftar.";
        res.status(401).json(payload);
        return;
    }
    delete owner.dataValues.createdAt;
    delete owner.dataValues.updatedAt;
    payload.pemilik = owner;
    res.json(payload);
}

async function addMember(req, res) {
    let ownerId = req.params.ownerId;
    let name = req.body.nama;
    let phone = req.body.noHp;
    let cost = req.body.biaya;
    let interval = req.body.interval;
    let startDate = req.body.tanggal_mulai;
    let payload = {
        success: true,
        message: "Berhasil menambahkan anggota.",
    };
    // find owner
    let findOwner = await Pemilik.findOne({where: {id: ownerId}});
    if (!findOwner) {
        payload.success = false;
        payload.message = "Pemilik tidak terdaftar.";
        res.status(401).json(payload);
        return;
    }
    // find if exist and create if not exist
    let findMember = await Anggota.findOrCreate({where: {noHp: phone}, defaults: {nama: name, noHp: phone}});
    // add member to ownner relation
    let setAnggota = await findOwner.addAnggota(findMember[0], {through: {biaya: cost, interval: interval}});
    // get detail of member that relationed
    let getMember = await findOwner.getAnggota({where: {noHp: phone}});
    let memberData = getMember[0];
    console.log(memberData)
    let findNgekos = await Ngekos.findOne({where: {id: memberData.Ngekos.id}});
    let createIncoice = await Tagihan.create({
        jumlah: memberData.Ngekos.biaya,
        mulai: startDate,
        akhir: startDate
    });
    let addInvoice = await findNgekos.addTagihans([createIncoice]);
    payload.anggota = {
        id: memberData.id,
        nama: memberData.nama,
        noHp: memberData.noHp,
        email: memberData.email,
        biaya: memberData.Ngekos.biaya,
        interval: memberData.Ngekos.interval
    };
    res.json(payload);
}

module.exports = {
    daftar,
    requestOtp,
    verifyOtp,
    addMember
};