

const ws = require('ws');
const serv = new ws.WebSocketServer({port: 7777});

const events = require('node:events');
const chan = new events.EventEmitter();

serv.on('connection', (sock) => {
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
