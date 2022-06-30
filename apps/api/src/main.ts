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
import {
  onCreateLobby,
  onDisconnecting,
  onJoinLobby,
  onLeaveLobby,
  onRequestRound,
  onSendChatMessage,
  onStartGame,
  onSubmitExplanation,
} from './app/socket';

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
  onDisconnecting(socket);
  onCreateLobby(socket);
  onJoinLobby(socket);
  onLeaveLobby(socket);
  onSendChatMessage(socket);
  onStartGame(socket);
  onRequestRound(socket);
  onSubmitExplanation(socket);
});

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
