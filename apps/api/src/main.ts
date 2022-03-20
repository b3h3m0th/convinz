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
import { getConnectedRoomClientNicknames } from './app/player';

const app = express();
const server = http.createServer(app);
export const io = new socketio.Server<
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
  socket.on('create', async (nickname, cb) => {
    const gameCode = generateGameCode();
    (socket as any).nickname = nickname;
    await socket.join(gameCode);
    const connectedClients = getConnectedRoomClientNicknames(gameCode);
    cb({
      gameCode: gameCode,
      error: false,
      nicknames: connectedClients,
    });
    await io.to(gameCode).emit('joined', nickname, connectedClients, gameCode);
  });

  socket.on('join', async (code, nickname, cb) => {
    (socket as any).nickname = nickname;
    await socket.join(code);
    const connectedClients = getConnectedRoomClientNicknames(code);
    cb({
      gameCode: code,
      error: false,
      nicknames: connectedClients,
    });
    await io.to(code).emit('joined', nickname, connectedClients, code);
  });

  socket.on('sendMessage', (message, gameCode) => {
    console.log(message);
    io.to(gameCode).emit('receiveMessage', message);
  });

  socket.on('leave', (cb) => {
    cb({ error: false });
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
