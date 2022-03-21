import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  Player,
  Role,
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
    addPlayer(new Player(socket.id, nickname, gameCode, Role.CAPTAIN));
    const connectedClients = getPlayersInRoom(gameCode);

    cb({
      gameCode: gameCode,
      error: false,
      players: connectedClients,
    });
    await io.to(gameCode).emit('joined', connectedClients, gameCode);
  });

  socket.on('join', async (code, nickname, gameAccessionType, cb) => {
    const alreadyConnectedClients = getPlayersInRoom(code);

    if (alreadyConnectedClients.length < 1) {
      cb({
        gameCode: code,
        error: true,
        players: alreadyConnectedClients,
      });
      await io.to(code).emit('joined', alreadyConnectedClients, code);
      return;
    }

    await socket.join(code);
    addPlayer(new Player(socket.id, nickname, code, Role.MEMBER));

    const connectedClientsAfterSelfJoin = getPlayersInRoom(code);

    cb({
      gameCode: code,
      error: false,
      players: connectedClientsAfterSelfJoin,
    });
    await io.to(code).emit('joined', connectedClientsAfterSelfJoin, code);
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

  socket.on('disconnecting', (reason) => {
    console.log('disconnect', reason); // the Set contains at least the socket ID
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
