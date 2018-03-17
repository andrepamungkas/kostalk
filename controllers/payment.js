const payment = require('../helpers/payment');
const logHelper = require('./log');
const models = require('../models');
const Tagihan = models.Tagihan;

async function callback(req, res) {
    let response = {
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
    let xmlResponse = await payment.jsonToXml(response);
    logHelper.addPaymentLog('checkPayment', req.body, xmlResponse);
    res.set('Content-Type', 'text/xml').send(xmlResponse)
}

module.exports = {
    callback
};