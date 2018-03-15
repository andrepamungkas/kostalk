const express = require('express');
const router = express.Router();
const payment = require('../controllers/payment');
const xmlparser = require('express-xml-bodyparser');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    res.json({
        hell: "yehs"
    })
});

router.post('/pembayaran/cb', xmlparser({trim: false, explicitArray: false}), payment.callback);

module.exports = router;
