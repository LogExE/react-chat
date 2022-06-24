
const http = require('http');
const path = require('path');
const events = require('node:events');
const express = require('express');
const ws = require('ws');

const app = express();
const dir = path.join(path.dirname(__dirname), 'client', 'build');
app.use(express.static(dir));
app.get('/', (req, res) => {
	res.sendFile(path.join(dir, 'index.html'));
});

const httpserv = http.createServer(app);
const websockserv = new ws.WebSocketServer({ server: httpserv });

const chan = new events.EventEmitter();

websockserv.on('connection', (sock) => {
	const random_shit = Math.random().toString(36).slice(2, 7);
	sock.on('message', (data) => {
		chan.emit('data', {author: random_shit, text: data.toString()});
	});
	sock.on('close', () => chan.emit('data', {author: 'SERVER', text: random_shit + ' left.'}));
	chan.on('data', (data) => {
		sock.send(JSON.stringify(data));
	});
	chan.emit('data', {author: 'SERVER', text: random_shit + ' joined.'});
});

httpserv.listen(8080, () => {
	console.log("Chat is on!");
});
