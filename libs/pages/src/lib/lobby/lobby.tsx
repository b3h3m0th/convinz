/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-empty-pattern */
import React, { ChangeEvent, useEffect, useState } from 'react';
import './lobby.scss';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { socket } from '@convinz/socket';
import { GameAccessionType, GameCode, Role } from '@convinz/shared/types';
import { ChatMessage } from 'libs/shared/types/src/lib/game/message';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import Game from '../game/game';

export interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = inject(gameStore.storeKey)(
  observer(({}: LobbyProps) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const getGameCodeFromURL: () => GameCode = () => {
      const parts = window.location.pathname.split('/');
      return parts[parts.length - 1];
    };

    useEffect(() => {
      const code = getGameCodeFromURL();
      if (code && !gameStore.hasJoinedLobby) {
        gameStore.setPlayer({
          ...gameStore.player,
          nickname: prompt('nickname') || 'anonymous',
        });

        socket.emit(
          'join',
          code,
          gameStore.player.nickname,
          GameAccessionType.INSTANT_URL,
          (result) => {
            if (!result.error) {
              console.log(`joined lobby: ${result.gameCode}`);
              gameStore.setHasJoinedLobby(true);
              gameStore.setGameCode(result.gameCode);
              gameStore.setConnectedPlayers(result.players);
            }
          }
        );
      }

      return () => {
        socket.emit('leave', gameStore.gameCode, (result) => {
          if (!result.error) {
            gameStore.setConnectedPlayers(result.players);
            gameStore.setHasJoinedLobby(false);
            gameStore.setHasGameStarted(false);
          }
        });
      };
    }, []);

    useEffect(() => {
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [message, ...prevMessages]);
      });
    }, []);

    return (
      <div className="lobby">
        <h1>game #{gameStore.gameCode}</h1>
        <button
          onClick={() => {
            socket.emit('leave', gameStore.gameCode, (result) => {
              if (!result.error) {
                gameStore.setHasJoinedLobby(false);
                gameStore.setGameCode(null);
                gameStore.setConnectedPlayers(result.players);
                navigate(`${ROUTES.home}`);
              }
            });
          }}
        >
          Leave lobby
        </button>
        <ul>
          <p>connected users</p>
          {gameStore.connectedPlayers.length > 0 &&
            gameStore.connectedPlayers.map((p, i) => (
              <li key={JSON.stringify(p)}>
                {p.nickname} {p.role === Role.CAPTAIN && '(Lobby Captain)'}
              </li>
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
            socket.emit('sendMessage', {
              sender: gameStore.player.nickname,
              message: message,
              lobby: gameStore.gameCode,
            })
          }
        >
          send
        </button>

        {gameStore.player.role === Role.CAPTAIN &&
        gameStore.connectedPlayers.length > 1 &&
        !gameStore.hasGameStarted ? (
          <button onClick={() => gameStore.startGame()}>Start game</button>
        ) : null}
        <div>{gameStore.hasGameStarted && <Game />}</div>
        <div>
          <ul>
            {messages.map((m, i) => (
              <li key={i}>
                {m.sender}: {m.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  })
);

export default Lobby;
