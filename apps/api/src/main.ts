import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';
import {
  ClientToServerEvents,
  defaultPlayer,
  defaultRoundsAmount,
  InterServerEvents,
  Player,
  Role,
  Round,
  ServerToClientEvents,
  SocketData,
} from '@convinz/shared/types';
import { generateGameCode, getRandomQuestion } from '@convinz/shared/util';
import { lobbies } from './app/game';

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
    lobbies.create(gameCode, defaultRoundsAmount, [newPlayer]);

    const lobby = lobbies.findByGameCode(gameCode);

    socket.emit('joinedLobby', {
      gameCode: gameCode,
      error: false,
      players: lobby.players,
      player: newPlayer,
      joinedPlayer: newPlayer,
    });
  });

  socket.on('joinLobby', async (gameCode, nickname, gameAccessionType) => {
    const alreadyConnectedClients = lobbies.findByGameCode(gameCode).players;

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

    lobbies.findByGameCode(gameCode).players.push(newPlayer);

    const connectedClientsAfterSelfJoin =
      lobbies.findByGameCode(gameCode).players;

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
    const leftPlayer = lobbies
      .findByGameCode(gameCode)
      .players.remove(socket.id);
    const connectedClients = lobbies.findByGameCode(gameCode).players;

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
    const captain = lobbies.findByGameCode(gameCode).players.captain;

    io.to(gameCode).emit('startedGame', {
      starterPlayer: captain,
      gameCode: gameCode,
      error: false,
    });
  });

  socket.on('requestRound', (gameCode) => {
    const question = getRandomQuestion();
    const lobby = lobbies.findByGameCode(gameCode);

    if (
      !lobby.currentRound ||
      lobby.currentRound.submissions.length === lobby.players.length
    ) {
      lobby.roundHistory.push(new Round(question));
    }

    io.to(gameCode).emit('receiveRound', {
      gameCode: gameCode,
      question,
    });
  });

  socket.on('submitExplanation', (gameCode, submission) => {
    const lobby = lobbies.findByGameCode(gameCode);

    lobby.currentRound.submissions.push({ [socket.id]: submission });

    io.to(gameCode).emit('receivedSubmission', {
      gameCode,
      submissions: lobby.currentRound.submissions,
    });
  });
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
