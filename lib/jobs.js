const Agenda = require('agenda');

let mongoConnectionString = 'mongodb://127.0.0.1/agenda';
let agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.on('ready', function() {
    agenda.start();
    console.log('penjadwalan mulai');
});

function graceful() {
    agenda.stop(function () {
        console.log('penjadwalan berhenti');
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;