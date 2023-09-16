const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
 
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors({
	origin: '*',
	methods: ['GET','POST']
}));

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);
console.log('Server started at http://'  + hostname + ':' + port);