const payment = require('../helpers/payment');
const models = require('../models');
const Tagihan = models.Tagihan;

async function callback(req, res) {
    let payload = {
        return: {
            type: "resnotification",
            ack: "00",
            bookingid: req.body.notification.bookingid,
            signature: req.body.notification.signature
        }
    };
    let invoice = await Tagihan.findOne({
        where: {
            id: req.body.notification.bookingid,
            jumlah: req.body.notification.amount
        }
    });
    if (invoice) {
        let invoiceUpdated = invoice.update({
            status: 'paid'
        });
    }
    console.log(req.body.notification.signature)
    let xmlPayload = await payment.jsonToXml(payload);
    res.set('Content-Type', 'text/xml').send(xmlPayload)
}

module.exports = {
    callback
};