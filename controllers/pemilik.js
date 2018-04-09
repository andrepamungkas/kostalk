const authHelper = require('../helpers/auth');
const commonHelper = require('../helpers/common');
const notificationHelper = require('../helpers/notification');
const moment = require('moment');
const models = require('../models');
const Op = require('sequelize').Op;
const Pemilik = models.Pemilik;
const Anggota = models.Anggota;
const Tagihan = models.Tagihan;
const Ngekos = models.Ngekos;
const Activation = models.Activation;
moment().format();

async function daftar(req, res) {
    let name = req.body.nama;
    let email = req.body.email;
    let phone = req.body.noHp;
    let payload = {
        success: true,
        message: 'Pendaftaran berhasil.',
    };
    let countOwner = await Pemilik.count({
        where: {[Op.or]: [{email: email}, {noHp: phone}]}
    });
    if (countOwner > 0) {
        payload.success = false;
        payload.message = 'Email telah terdaftar.';
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
        message: 'Kode berhasil dibuat.',
        otp: {}
    };
    let otp = await authHelper.requestOtp(key);
    // todo : tambah pengiriman sms/email
    payload.otp.kunci = otp.dataValues.kunci;
    res.json(payload);
}

async function verifyOtp(req, res) {
    let key = req.body.kunci;
    let code = req.body.kode;
    let payload = {
        success: true,
        message: 'Kode berhasil diverifikasi.',
    };
    // check otp
    let verifyOtp = await authHelper.verifyOtp(key, code);
    if (!verifyOtp) {
        payload.success = false;
        payload.message = 'Kode salah.';
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
        payload.message = 'Pengguna tidak terdaftar.';
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
        message: 'Berhasil menambahkan anggota.',
    };
    // find owner
    let findOwner = await Pemilik.findOne({where: {id: ownerId}});
    if (!findOwner) {
        payload.success = false;
        payload.message = 'Pemilik tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }
    // check if owner has member that has that phone
    let checkMember = await findOwner.getAnggota({where: {noHp: phone}});
    if (checkMember.length > 0) {
        payload.success = false;
        payload.message = 'Anda sudah memiliki anggota dengan nomor hp ' + phone + '.';
        res.status(409).json(payload);
        return;
    }
    // find if member exist and create if not exist
    let findMember = await Anggota.findOrCreate({where: {noHp: phone}, defaults: {nama: name, noHp: phone}});
    // add member to ownner relation
    let setAnggota = await findOwner.addAnggota(findMember[0], {through: {biaya: cost, interval: interval}});
    // get detail of member that relationed
    let getMember = await findOwner.getAnggota({where: {noHp: phone}});
    let memberData = getMember[0];
    let findNgekos = await Ngekos.findOne({where: {id: memberData.Ngekos.id}});
    let start = await moment(startDate).format();
    let end = await moment(start).add(interval, 'months').subtract(1, 'days').format();
    let createIncoice = await Tagihan.create({
        jumlah: memberData.Ngekos.biaya,
        mulai: start,
        akhir: end
    });
    // add invoice
    let addInvoice = await findNgekos.addTagihans([createIncoice]);
    let addActivation = await Activation.create({
        idNgekos: findNgekos.id,
        token: await commonHelper.generateToken(),
        ttl:86400000
    });
    // todo : mengirim sms ke anggota
    let activationUrl = 'http://localhost:3003/anggota/verifikasi?id='+memberData.id+'&key='+addActivation.token;
    let shortUrl = await commonHelper.shortUrl(activationUrl);
    let smsContent = 'Hai kak, kamu ditambahkan ke kos ' + findOwner.name + '.\n' +
        'Harga: ' + await commonHelper.idrCurrency(memberData.Ngekos.biaya) + '/' + memberData.Ngekos.interval +
        ' bln.\n' + 'Silakan verifikasi di ' + shortUrl + ' untuk mendapat kode pembayaran.';
    // notificationHelper.sendSms(memberData.noHp, smsContent);
    console.log(smsContent);
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

async function getMembers(req, res) {
    let ownerId = req.params.ownerId;
    let payload = {
        success: true,
        message: 'Berhasil mendapatkan daftar anggota.',
    };
    // find owner
    let findOwner = await Pemilik.findOne({where: {id: ownerId}});
    if (!findOwner) {
        payload.success = false;
        payload.message = 'Pemilik tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }
    let members = await findOwner.getAnggota({
        attributes: ['id', 'nama', 'noHp', 'email']
    });
    payload.data = [];
    for (i in members) {
        let member = members[i];
        let memberData = {
            id: member.id,
            nama: member.nama,
            noHp: member.noHp,
            email: member.email,
            biaya: member.Ngekos.biaya,
            interval: member.Ngekos.interval
        };
        let invoice = await member.Ngekos.getTagihans({
            attributes: ['jumlah', 'mulai', 'akhir', 'status'],
            order: [['akhir', 'DESC']]
        });
        memberData.tagihan = invoice[0];
        payload.data.push(memberData);
    }
    res.json(payload);
}

async function updateOwner(req,res) {
    let ownerId = req.params.ownerId;
    let findOwner = await Pemilik.findOne({where: {id: ownerId}});
    let payload = {
        success: true,
        message: 'Berhasil mendapatkan data pemilik.',
    };
    if (!findOwner) {
        payload.success = false;
        payload.message = 'Pemilik tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }else {
        findOwner.update(req.body).then(()=>{
            payload.data = findOwner;
            res.json(payload);
        })
    }
}

async function getOwner(req,res) {
    let ownerId = req.params.ownerId;
    let findOwner = await Pemilik.findOne({where: {id: ownerId}});
    let payload = {
        success: true,
        message: 'Berhasil mendapatkan data pemilik.',
    };
    if (!findOwner) {
        payload.success = false;
        payload.message = 'Pemilik tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }
    payload.data = findOwner;
    res.json(payload);
}

async function updateAnggota(req,res){
    let ownerId = req.params.ownerId;
    let memberId = req.params.memberId;
    let findOwner = await Pemilik.findById(ownerId);
    let findMember = await Anggota.findById(memberId);
    let payload = {
        success: true,
        message: 'Berhasil mengubah data Anggota.'
    };
    if (!findOwner) {
        payload.success = false;
        payload.message = 'Pemilik tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }

    if (!findMember) {
        payload.success = false;
        payload.message = 'Anggota tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }
    let members = await findMember.update(req.body).then((member)=>{
        payload.data = member;
        res.json(payload);
    });

}

async function deleteAnggota(req,res){
    let ownerId = req.params.ownerId;
    let memberId = req.params.memberId;
    let findOwner = await Pemilik.findById(ownerId);
    let findNgekos = await Ngekos.findOne({where : {idAnggota: memberId,idPemilik: ownerId}});
    let payload = {
        success: true,
        message: 'Berhasil menghapus data Anggota.',
    };
    if (!findOwner) {
        payload.success = false;
        payload.message = 'Pemilik tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }

    if (!findNgekos) {
        payload.success = false;
        payload.message = 'Anggota tidak terdaftar.';
        res.status(401).json(payload);
        return;
    }
    let ngekos = await findNgekos.destroy({where:{idAnggota:memberId}}).then((member)=>{
        payload.data = member;
        res.json(payload);
    });

    res.json(findNgekos);
}

module.exports = {
    daftar,
    requestOtp,
    verifyOtp,
    addMember,
    getMembers,
    updateOwner,
    getOwner,
    updateAnggota,
    deleteAnggota
};