const mail = require('@sendgrid/mail');
const client = require('twilio')(process.env.TWILLIO_ACCOUNT_SID, process.env.TWILLIO_AUTH_TOKEN);
const models = require('../models');
const Pemilik = models.Pemilik;
const Anggota = models.Anggota;
mail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOtpEmail(to, code) {
    const htmlOtp = '<div class="container">' +
        '<div class="content">' +
        '<h3>Kode verifikasi Anda</h3>' +
        '<h2>' + code + '</h2>' +
        '</div>' +
        '<div class="footer">Kode ini digunakan untuk masuk ke sistem Kostalk</div>' +
        '</div>';
    let message = {
        to: to,
        from: 'andre@hover.id',
        subject: 'Kode masuk Kostalk',
        html: htmlOtp
    };
    mail.send(message);
}

async function sendSms(to, content) {
    to.indexOf('0') == 0 ? to = to.replace('0', '+62') : to = '+62' + to;
    return await client.messages
        .create({
            to: to,
            from: process.env.TWILLIO_PHONE_NUMBER,
            body: content
        });
}

module.exports = {
    sendOtpEmail,
    sendSms
};