/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-empty-pattern */
import React, { ChangeEvent, useEffect, useState } from 'react';
import './game.scss';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { socket } from '@convinz/socket';
import { GameCode } from '@convinz/shared/types';

export interface GameProps {}

export const Game: React.FC<GameProps> = inject(gameStore.storeKey)(
  observer(({}: GameProps) => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);

    const getGameCodeFromURL: () => GameCode = () => {
      const parts = window.location.pathname.split('/');
      return parts[parts.length - 1];
    };

    useEffect(() => {
      const code = getGameCodeFromURL();
      if (code) {
        console.log(code);
        socket.emit('join', code, 'user');
        gameStore.setGameCode(code);
      }
    }, []);

    socket.on('receiveMessage', (message) => {
      setMessages([message, ...messages]);
    });

    return (
      <div className="game">
        <h1>game</h1>
        <input
          type="text"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <button
          onClick={() =>
            socket.emit('sendMessage', message, gameStore.gameCode)
          }
        >
          send
        </button>
        <div>
          <ul>
            {messages.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  })
);

export default Game;
