require('dotenv').config();
module.exports = {
    'development': {
        'username': process.env.DB_USERNAME || 'root',
        'password': process.env.DB_PASSWORD || '',
        'database': process.env.DB_NAME || 'kostalk',
        'host': process.env.DB_HOSTNAME || '127.0.0.1',
        'dialect': 'mysql',
        'timezone': '+07:00',
        'logging': console.log
    },
    'test': {
        'username': 'root',
        'password': null,
        'database': 'database_test',
        'host': '127.0.0.1',
        'dialect': 'mysql',
        'timezone': '+07:00'
    },
    'production': {
        'username': process.env.DB_USERNAME || '',
        'password': process.env.DB_PASSWORD || '',
        'database': process.env.DB_NAME || 'kostalk',
        'host': process.env.DB_HOSTNAME || '',
        'dialect': 'mysql',
        'timezone': '+07:00'
    }
};
