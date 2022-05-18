const path = require('path');
const express = require('express')
const router = express.Router()
const morgan = require('morgan')
const upload = require('./middlewares/upload');
const uploadReadings = require('./middlewares/upload-readings');
const modules = require('./middlewares/modules');
const pdf = require('./middlewares/pdf');
const modules_get = require('./middlewares/modules_get');

router.use('/images',express.static(path.join(__dirname, '../uploads')));

router.use(morgan('dev'));
router.use(express.json());

router.get('/pdf/:function/:param/:auth/:name',pdf);
router.post('/upload/:function',upload);
router.post('/upload-readings/:apiKey/:unitCode/:date',uploadReadings);
router.post('/:module/:function',modules);
router.get('/:module/:function',modules_get);

router.get('/', function (req, res) {
    res.send('main api index');
})

router.post('/', function (req, res) {
    res.send('main api index');
})

router.post('/:module', function (req, res) {
    res.status(500);
    res.send({ message: `Cannot find module ${req.params.module}` });
});

module.exports = router