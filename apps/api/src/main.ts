import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  Player,
  ServerToClientEvents,
  SocketData,
} from '@convinz/shared/types';
import { generateGameCode } from '@convinz/shared/util';
import { addPlayer, getPlayersInRoom, removePlayer } from './app/player';

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
    await socket.join(gameCode);
    addPlayer(new Player(socket.id, nickname, gameCode));
    const connectedClients = getPlayersInRoom(gameCode);

    cb({
      gameCode: gameCode,
      error: false,
      players: connectedClients,
    });
    await io.to(gameCode).emit('joined', connectedClients, gameCode);
  });

  socket.on('join', async (code, nickname, cb) => {
    await socket.join(code);
    addPlayer(new Player(socket.id, nickname, code));

    const connectedClients = getPlayersInRoom(code);
    cb({
      gameCode: code,
      error: false,
      players: connectedClients,
    });
    await io.to(code).emit('joined', connectedClients, code);
  });

  socket.on('leave', async (code, cb) => {
    removePlayer(socket.id);
    const connectedClients = getPlayersInRoom(code);
    socket.leave(code);

    await io.to(code).emit('left', connectedClients, code);

    cb({ error: false, players: connectedClients });
  });

  socket.on('sendMessage', (message) => {
    io.to(message.lobby).emit('receiveMessage', message);
  });

  socket.on('disconnecting', () => {
    console.log('disconnect', socket.rooms); // the Set contains at least the socket ID
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
