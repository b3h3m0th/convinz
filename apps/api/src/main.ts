import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.get('/api', (req, res) => {
  res.json({ hi: 'hi' });
});

io.on('connect', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
