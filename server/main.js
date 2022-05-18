require('../helpers/init');
const express = require('express');
const server_port = process.env.PORT || 3030;
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const api = require('./main_api.js');
const payments = require('./middlewares/payments');

app.use(useragent.express());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-credentials");
    next();
});

app.use('/api',api);

app.get('/', function (req, res) {
    res.send('system index')
})

app.get('/payments/:module',payments);
app.post('/payments/:module',payments);

app.listen(server_port, () => console.log(`Listening on port ${server_port}!`))