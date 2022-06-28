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
  socket.on('disconnecting', (reason) => {
    console.log('disconnect', reason);
  });

  socket.on('createGame', async (nickname) => {
    const gameCode = generateGameCode();
    await socket.join(gameCode);

    const newPlayer = new Player(socket.id, nickname, gameCode, Role.CAPTAIN);
    addPlayer(newPlayer);
    const connectedClients = getPlayersInRoom(gameCode);

    socket.emit('joined', {
      gameCode: gameCode,
      error: false,
      players: connectedClients,
      player: newPlayer,
    });
  });

  socket.on('joinGame', async (gameCode, nickname, gameAccessionType) => {
    const alreadyConnectedClients = getPlayersInRoom(gameCode);

    // if (alreadyConnectedClients.length < 1) {
    //   io.to(gameCode).emit('joined', {
    //     gameCode: gameCode,
    //     player: null,
    //     players: alreadyConnectedClients,
    //     error: false,
    //   });
    //   return;
    // }

    await socket.join(gameCode);
    const newPlayer = new Player(socket.id, nickname, gameCode, Role.MEMBER);
    addPlayer(newPlayer);

    const connectedClientsAfterSelfJoin = getPlayersInRoom(gameCode);

    io.to(gameCode).emit('joined', {
      gameCode: gameCode,
      error: false,
      players: connectedClientsAfterSelfJoin,
      player: null,
    });

    socket.emit('joined', {
      gameCode: gameCode,
      error: false,
      players: connectedClientsAfterSelfJoin,
      player: newPlayer,
    });
  });

  socket.on('leaveGame', async (code) => {
    const leftPlayer = removePlayer(socket.id);
    const connectedClients = getPlayersInRoom(code);

    if (leftPlayer.role === Role.CAPTAIN && connectedClients.length > 0) {
      connectedClients[0].role = Role.CAPTAIN;
    }
    socket.leave(code);

    io.to(code).emit('left', { players: connectedClients, error: false });
  });

  socket.on('sendMessage', (message) => {
    io.to(message.lobby).emit('receiveMessage', message);
  });

  socket.on('start', (gameCode) => {
    io.to(gameCode).emit('started', { gameCode: gameCode, error: false });
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
