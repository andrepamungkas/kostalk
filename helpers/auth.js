const models = require('../models');
const Otp = models.Otp;

async function requestOtp(key) {
    // delete previous code that same key
    let otp = await Otp.findAndCount({where: {kunci: key}});
    for (i in otp.rows) {
        otp.rows[i].destroy();
    }
    // generate code and store to db
    let code = Math.floor(100000 + Math.random() * 900000);
    let ttl = 1800000; //30 minute
    let createOtp = await Otp.create({
        kunci: key,
        kode: code,
        ttl: ttl
    });
    return createOtp;
}

async function verifyOtp(key, code) {
    let verify = await Otp.findOne({where: {kunci: key, kode: code}});
    return verify;
}

module.exports = {
    requestOtp,
    verifyOtp
};