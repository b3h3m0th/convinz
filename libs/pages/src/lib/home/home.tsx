import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@convinz/shared/types';
import { ChangeEvent, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './home.scss';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3333',
  {
    transports: ['websocket'],
  }
);

socket.on('connect', () => {
  console.log(socket.id);
});

/* eslint-disable-next-line */
export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const [gameCode, setGameCode] = useState<string>('');

  console.log(gameCode);

  const onJoinGame = () => {
    console.log('join');
  };

  const onCreateGame = () => {
    socket.emit('join', gameCode);
  };

  return (
    <div className="home">
      <h1>home</h1>
      <div className="home__content">
        <input
          type="text"
          className="home__content__game-code-input"
          value={gameCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGameCode(e.currentTarget.value)
          }
        />
        <button onClick={() => onJoinGame()}>Join Game</button>
        <button onClick={() => onCreateGame()}>Create Game</button>
      </div>
    </div>
  );
};

export default Home;
