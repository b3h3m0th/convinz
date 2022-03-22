/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-empty-pattern */
import React, { ChangeEvent, useEffect, useState } from 'react';
import './lobby.scss';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { socket } from '@convinz/socket';
import { Role } from '@convinz/shared/types';
import { ChatMessage } from 'libs/shared/types/src/lib/game/message';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import Game from '../game/game';
import {
  ActionIcon,
  Button,
  Navbar,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Crown,
} from 'tabler-icons-react';

export interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = inject(gameStore.storeKey)(
  observer(({}: LobbyProps) => {
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
      if (!gameStore.hasJoinedLobby) {
        navigate(`${ROUTES.home}`);
        notifications.showNotification({
          message: 'Please join via game code only!',
          color: 'orange',
          icon: (
            <ActionIcon size={32}>
              <AlertTriangle size={16} color="white" />
            </ActionIcon>
          ),
        });
      }

      return () => {
        if (gameStore.hasJoinedLobby) {
          socket.emit('leave', gameStore.gameCode, (result) => {
            if (!result.error) {
              gameStore.setConnectedPlayers(result.players);
              gameStore.setHasJoinedLobby(false);
              gameStore.setHasGameStarted(false);
            }
          });
        }
      };
    }, []);

    useEffect(() => {
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [message, ...prevMessages]);
      });
    }, []);

    return (
      <div className="lobby">
        <Navbar height={750} width={{ sm: 300 }} p={'sm'}>
          <Navbar.Section grow>
            <Title order={3} mb={'sm'}>
              Lobby #{gameStore.gameCode}
            </Title>
            <Button
              onClick={() => {
                socket.emit('leave', gameStore.gameCode, (result) => {
                  console.log('leave');
                  if (!result.error) {
                    gameStore.setHasJoinedLobby(false);
                    gameStore.setGameCode(null);
                    gameStore.setConnectedPlayers(result.players);
                    navigate(`${ROUTES.home}`);
                  }
                });
              }}
              leftIcon={<ArrowLeft size={18} />}
            >
              Leave Lobby
            </Button>
            <Table mt={'md'} mb={'md'}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 0 }}>Connected Users</th>
                </tr>
              </thead>
              <tbody>
                {gameStore.connectedPlayers.map((p) => (
                  <tr key={JSON.stringify(p)} style={{ textAlign: 'left' }}>
                    <td style={{ paddingLeft: 0 }}>
                      <Text
                        color={p.id === gameStore.player.id ? 'blue' : ''}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {p.nickname}{' '}
                        {p.role === Role.CAPTAIN && (
                          <Crown style={{ paddingLeft: '4px' }} />
                        )}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <TextInput
              size="md"
              rightSection={
                <ActionIcon
                  size={32}
                  radius="sm"
                  onClick={() => {
                    socket.emit('sendMessage', {
                      sender: gameStore.player.nickname,
                      message: message,
                      lobby: gameStore.gameCode,
                    });
                  }}
                >
                  <ArrowRight size={18} />
                </ActionIcon>
              }
              placeholder="Chat"
              rightSectionWidth={42}
              value={message}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
            />

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
          </Navbar.Section>
        </Navbar>
      </div>
    );
  })
);

export default Lobby;
