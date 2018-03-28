const moment = require('moment');
const agenda = require('../lib/jobs');
const notificationHelper = require('../helpers/notification');

async function createJob(name, date, data) {
    await agenda.define(name, function(job, done) {
        console.log(name);
        done()
    });
    await agenda.schedule(moment(date).add(5, 'hours').format(), name, data);
}

module.exports = {
    createJob
};