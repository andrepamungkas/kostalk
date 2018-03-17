const models = require('../models');
const axios = require('axios');
const xml2js = require('xml2js');
const moment = require('moment');
const commonHelper = require('./common');
const logHelper = require('./log');
const Ngekos = models.Ngekos;
const Pemilik = models.Pemilik;
const Anggota = models.Anggota;
const Tagihan = models.Tagihan;
const parser = new xml2js.Parser({explicitArray: false});
const builder = new xml2js.Builder();
moment().format();

async function jsonToXml(json) {
    return await builder.buildObject(json);
}

async function xmlToJson(xml) {
    return new Promise((resolve, reject) => {
        parser.parseString(xml, function (err, json) {
            if (err) reject(err);
            else resolve(json);
        });

    });
}

async function makePayment(subscribeId) {
    let subscribe = await Ngekos.findById(subscribeId);
    let member = await Anggota.findById(subscribe.idAnggota);
    let invoice = await Tagihan.findOne({order: [['id', 'DESC']]});
    let request = {
        data: {
            type: "reqpaymentcode",
            bookingid: invoice.id + 1,
            clientid: subscribe.idPemilik + '.' + subscribe.idAnggota,
            customer_name: member.nama,
            amount: subscribe.biaya,
            productid: subscribe.idPemilik,
            interval: "120",
            username: process.env.BERSAMAID_USERNAME,
            booking_datetime: await moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            signature: await commonHelper.md5(
                process.env.BERSAMAID_USERNAME + process.env.BERSAMAID_PASSWORD + (invoice.id + 1))
        }
    };
    let xml = await jsonToXml(request);
    let callApi = await axios.post('https://bersama.id/portal/index.php/api/tfp/generatePaymentCode', xml);
    logHelper.addPaymentLog('requestPayment', xml, callApi.data);
    let response = await xmlToJson(callApi.data);
    return response;
}

async function checkPayment(vaid, booking_datetime) {
    let request = {
        data: {
            type: "reqtrxstatus",
            item01: {
                vaid: vaid,
                booking_datetime: await moment(booking_datetime).format('YYYY-MM-DD hh:mm:ss'),
                username: process.env.BERSAMAID_USERNAME,
                signature: await commonHelper.md5(
                    process.env.BERSAMAID_USERNAME + process.env.BERSAMAID_PASSWORD + (invoice.id + 1))
            }
        }
    };
    let xml = await jsonToXml(request);
    let callApi = await axios.post('url', xml);
    logHelper.addPaymentLog('checkPayment', xml, callApi.data);
    let response = await xmlToJson(callApi.data);
    return response;
}

module.exports = {
    xmlToJson,
    jsonToXml,
    makePayment,
    checkPayment
};