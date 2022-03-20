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
import { generateGameCode } from '@convinz/shared/util';

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
  res.json({ convinz: 'convinz' });
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('create', (nickname) => {
    const gameCode = generateGameCode();
    (socket as any).nickname = nickname;
    socket.join(gameCode);
    socket.emit('created', gameCode);
    console.log(socket);
  });

  socket.on('join', (code, nickname) => {
    (socket as any).nickname = nickname;
    socket.join(code);
    socket.emit('joined', code);
  });

  socket.on('sendMessage', (message, gameCode) => {
    console.log(message);
    // io.sockets.in(gameCode).emit('receiveMessage', message);
    // socket.to(gameCode).emit('receiveMessage', message);
    io.to(gameCode).emit('receiveMessage', message);
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
