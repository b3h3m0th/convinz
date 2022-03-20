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
      if (code && !gameStore.hasJoinedLobby) {
        socket.emit('join', code, 'user', (result) => {
          if (!result.error) {
            gameStore.setHasJoinedLobby(true);
            console.log(`joined lobby: ${result.gameCode}`);
            gameStore.setGameCode(result.gameCode);
          }
        });
      }

      socket.on('joined', (nickname, nicknames, gameCode) => {
        gameStore.setConnectedPlayers(nicknames);
      });

      return () => {
        socket.emit('leave', (result) => {
          if (!result.error) socket.off();
        });
      };
    }, []);

    useEffect(() => {
      socket.on('receiveMessage', (message) => {
        console.log(messages);
        setMessages([message, ...messages]);
      });
    }, [messages]);

    return (
      <div className="game">
        <h1>game</h1>
        <ul>
          <p>connected users</p>
          {gameStore.connectedPlayers.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
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
