/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-empty-pattern */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './lobby.scss';
import { chatStore, gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { socket } from '@convinz/socket';
import { Role } from '@convinz/shared/types';
import { ChatMessage } from 'libs/shared/types/src/lib/game/message';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import Game from '../game/game';
import {
  ActionIcon,
  AppShell,
  Button,
  Navbar,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Crown,
} from 'tabler-icons-react';
import { useClipboard } from '@mantine/hooks';
import { useBeforeUnload } from '@convinz/shared/hooks';

export interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = inject(
  gameStore.storeKey,
  chatStore.storeKey
)(
  observer(({}: LobbyProps) => {
    const navigate = useNavigate();
    const notifications = useNotifications();
    const clipboard = useClipboard({ timeout: 500 });
    const chatViewport = useRef<HTMLDivElement>(null);

    const [message, setMessage] = useState<string>('');

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

      socket.on('receiveChatMessage', (message) => {
        chatStore.addMessage(message);
        scrollChatToBottom();
      });
    }, []);

    useEffect(() => {
      if (!gameStore.hasJoinedLobby || !gameStore.player.room)
        navigate(`${ROUTES.home}`);
    }, [gameStore.hasJoinedLobby, gameStore.player.room]);

    useBeforeUnload(() => {
      if (gameStore.hasJoinedLobby)
        socket.emit('leaveLobby', gameStore.player.room);
    });

    const scrollChatToBottom = () =>
      chatViewport.current?.scrollTo({
        top: chatViewport.current.scrollHeight,
        behavior: 'smooth',
      });

    const clearChatInput = () => setMessage('');

    const sendChatMessage = () => {
      if (message.length < 1) return;

      socket.emit('sendChatMessage', {
        sender: gameStore.player.nickname,
        message: message,
        lobby: gameStore.player.room,
      });
      scrollChatToBottom();
      clearChatInput();
    };

    return (
      <div className="lobby">
        <AppShell
          navbar={
            <Navbar width={{ base: 350 }} p={'sm'}>
              <Navbar.Section grow>
                <Tooltip
                  position="bottom"
                  withArrow
                  label="Copied"
                  opened={clipboard.copied}
                  mb={'sm'}
                >
                  <Title
                    style={{ cursor: 'pointer' }}
                    order={3}
                    onClick={() => clipboard.copy(gameStore.player.room)}
                  >
                    Lobby #{gameStore.player.room}
                  </Title>
                </Tooltip>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    onClick={() =>
                      socket.emit('leaveLobby', gameStore.player.room)
                    }
                    leftIcon={<ArrowLeft size={18} />}
                  >
                    Leave Lobby
                  </Button>
                  {gameStore.player.role === Role.CAPTAIN &&
                  gameStore.connectedPlayers.length > 1 &&
                  !gameStore.hasGameStarted ? (
                    <Button onClick={() => gameStore.startGame()} ml={'xs'}>
                      Start Game
                    </Button>
                  ) : null}
                </div>

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
              </Navbar.Section>

              <Navbar.Section
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                  maxHeight: '50%',
                  height: '50%',
                }}
              >
                <ScrollArea viewportRef={chatViewport}>
                  <ul className="lobby__chat">
                    {chatStore.messages.map((m, i) => (
                      <li
                        className="lobby__chat__message"
                        key={`${JSON.stringify(m)}-${i}`}
                      >
                        {m.sender}: {m.message}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <TextInput
                  size="md"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') sendChatMessage();
                  }}
                  rightSection={
                    <ActionIcon
                      size={32}
                      radius="sm"
                      onClick={() => sendChatMessage()}
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
              </Navbar.Section>
            </Navbar>
          }
        >
          <div>{gameStore.hasGameStarted && <Game />}</div>
        </AppShell>
      </div>
    );
  })
);

export default Lobby;
