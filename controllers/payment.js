const payment = require('../helpers/payment');
const logHelper = require('../helpers/log');
const models = require('../models');
const Ngekos = models.Ngekos;
const Tagihan = models.Tagihan;
const RiwayatTransaksi = models.RiwayatTransaksi;

async function callback(req, res) {
    let request = req.body.notification;
    console.log(request)
    let response = {
        return: {
            type: "resnotification",
            ack: "00",
            bookingid: req.body.notification.bookingid,
            signature: req.body.notification.signature
        }
    };
    let clientId = request.clientid.split('.');
    let ngekos = await Ngekos.findOne({where: {idPemilik: clientId[0], idAnggota: clientId[1]}});
    if (!ngekos) {
        return res.status(404).end();
    }
    let invoice = await Tagihan.findOne({
        where: {
            idNgekos: ngekos.id,
            jumlah: request.amount,
            status: 'pending'
        }
    });
    if (!invoice) {
        return res.status(404).end();
    }
    await invoice.update({
        status: 'paid'
    });
    let xmlResponse = await payment.jsonToXml(response);
    await logHelper.addPaymentLog('checkPayment', JSON.stringify(req.body), xmlResponse);
    await RiwayatTransaksi.bulkCreate([
        {
            aliran: 'in',
            jumlah: request.amount-(request.amount*0.01),
            keterangan: 'pendapatan',
            idAnggota: clientId[1],
            idPemilik: clientId[0]
        },
        {
            aliran: 'out',
            jumlah: request.amount*0.01,
            keterangan: 'pendapatan',
            idAnggota: clientId[1],
            idPemilik: clientId[0]
        }]);
    res.set('Content-Type', 'text/xml').send(xmlResponse)
}

module.exports = {
    callback
};