import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@convinz/shared/types';
import { createGameCode } from '@convinz/shared/util';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: ['http://localhost:4200'],
  },
});
app.use(cors());

app.get('/api', (req, res) => {
  res.json({ hi: 'hi' });
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('create', () => {
    const gameCode = createGameCode();
    socket.join(gameCode);
    socket.emit('created', gameCode);
  });

  socket.on('join', (code) => {
    socket.join(code);
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
