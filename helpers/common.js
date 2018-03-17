const crypto = require('crypto');
const axios = require('axios');

async function isEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

function random() {
    return Math.random().toString(36).substr(2);
}

async function generateToken() {
    return random() + random() + random();
}

async function shortUrl(longUrl) {
    try {
        let short = await axios.post('https://www.googleapis.com/urlshortener/v1/url?key='+process.env.GOOGLE_SHORTENER_API_KEY,
            {longUrl: longUrl});
        return short.data.id;
    } catch (error) {
        console.error(error);
        console.error(error.response.data.error.errors);
    }
}

module.exports = {
    isEmail,
    md5,
    generateToken,
    shortUrl
};