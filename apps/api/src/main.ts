import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';
import {
  ClientToServerEvents,
  defaultPlayer,
  InterServerEvents,
  Player,
  Role,
  ServerToClientEvents,
  SocketData,
} from '@convinz/shared/types';
import { generateGameCode } from '@convinz/shared/util';
import { players } from './app/player';

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

  socket.on('createLobby', async (nickname) => {
    const gameCode = generateGameCode();
    await socket.join(gameCode);

    const newPlayer = new Player(socket.id, nickname, gameCode, Role.CAPTAIN);
    players.add(newPlayer);
    const connectedClients = players.getPlayersInRoom(gameCode);

    socket.emit('joinedLobby', {
      gameCode: gameCode,
      error: false,
      players: connectedClients,
      player: newPlayer,
      joinedPlayer: newPlayer,
    });
  });

  socket.on('joinLobby', async (gameCode, nickname, gameAccessionType) => {
    const alreadyConnectedClients = players.getPlayersInRoom(gameCode);

    if (alreadyConnectedClients.length < 1) {
      io.to(gameCode).emit('joinedLobby', {
        gameCode: gameCode,
        players: alreadyConnectedClients,
        error: false,
      });
      return;
    }

    await socket.join(gameCode);
    const newPlayer = new Player(socket.id, nickname, gameCode, Role.MEMBER);
    players.add(newPlayer);

    const connectedClientsAfterSelfJoin = players.getPlayersInRoom(gameCode);

    // answer for new player
    socket.emit('joinedLobby', {
      gameCode: gameCode,
      error: false,
      players: connectedClientsAfterSelfJoin,
      player: newPlayer,
      joinedPlayer: newPlayer,
    });

    // broadcast for already connected players
    socket.to(gameCode).emit('joinedLobby', {
      gameCode: gameCode,
      error: false,
      players: connectedClientsAfterSelfJoin,
      joinedPlayer: newPlayer,
    });
  });

  socket.on('leaveLobby', async (gameCode) => {
    const leftPlayer = players.remove(socket.id);
    const connectedClients = players.getPlayersInRoom(gameCode);

    if (leftPlayer.role === Role.CAPTAIN && connectedClients.length > 0) {
      connectedClients[0].role = Role.CAPTAIN;
    }

    // answer for left player
    socket.emit('leftLobby', {
      error: false,
      players: connectedClients,
      player: defaultPlayer,
      leftPlayer: leftPlayer,
    });

    // broadcast for already connected players
    socket.to(gameCode).emit('leftLobby', {
      error: false,
      players: connectedClients,
      leftPlayer: leftPlayer,
    });

    socket.leave(gameCode);
  });

  socket.on('sendChatMessage', (message) => {
    io.to(message.lobby).emit('receiveChatMessage', message);
  });

  socket.on('startGame', (gameCode) => {
    const starterPlayer = players.getCaptainInRoom(gameCode);

    io.to(gameCode).emit('startedGame', {
      starterPlayer,
      gameCode: gameCode,
      error: false,
    });
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
