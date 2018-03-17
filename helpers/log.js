const models = require('../models');
const PaymentLog = models.PaymentLog;

async function addPaymentLog(type, request, response) {
    return PaymentLog.create({
        type: type,
        request: request,
        response: response
    });
}

module.exports = {
    addPaymentLog
};