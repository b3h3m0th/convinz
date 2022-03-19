import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@convinz/shared/types';
import type { GameCode } from '@convinz/shared/types';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
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
  console.log(`connected with id: ${socket.id}`);
});

socket.on('created', (gameCode) => {
  console.log(`created lobby: ${gameCode}`);
});

/* eslint-disable-next-line */
export interface HomeProps {}

export const Home: React.FC<HomeProps> = inject(gameStore.storeKey)(
  observer((props: HomeProps) => {
    const onJoinGame = () => {
      if (gameStore.gameCode) {
        console.log('join', gameStore.gameCode);
      }
    };

    const onCreateGame = () => {
      socket.emit('create');
    };

    console.log(gameStore.gameCode);

    return (
      <div className="home">
        <h1>home</h1>
        <div className="home__content">
          <input
            type="text"
            className="home__content__game-code-input"
            value={`#${
              (gameStore.gameCode as string)
                ? (gameStore.gameCode as string)
                : ''
            }`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              gameStore.setGameCode(
                e.currentTarget.value.substring(1).toUpperCase() as GameCode
              )
            }
          />
          <button onClick={() => onJoinGame()}>Join Game</button>
          <button onClick={() => onCreateGame()}>Create Game</button>
        </div>
      </div>
    );
  })
);

export default Home;
