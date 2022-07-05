/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-empty-pattern */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './lobby.scss';
import { chatStore, gameStore, settingsStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { socket } from '@convinz/socket';
import { minPlayerAmount, Role } from '@convinz/shared/types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import Game from '../game/game';
import {
  ActionIcon,
  Affix,
  AppShell,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
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
  Crown,
  PlayCard,
  Message,
  QuestionMark,
  Settings,
  Copy,
  InfoCircle,
} from 'tabler-icons-react';
import { useClipboard } from '@mantine/hooks';
import { useBeforeUnload } from '@convinz/shared/hooks';
import { InstructionsModal, SettingsModal } from '@convinz/components';
import { useTranslation } from 'react-i18next';

export interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = inject(
  gameStore.storeKey,
  chatStore.storeKey,
  settingsStore.storeKey
)(
  observer(({}: LobbyProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const notifications = useNotifications();
    const gameCodeClipboard = useClipboard({ timeout: 500 });
    const inviteLinkClipboard = useClipboard({ timeout: 500 });
    const chatViewport = useRef<HTMLDivElement>(null);
    const connectedPlayersViewport = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
      if (!gameStore.hasJoinedLobby) {
        const splits = window.location.href.split('/');
        gameStore.player.room = splits[splits.length - 1];
        navigate(`${ROUTES.home}`);
        notifications.showNotification({
          message: 'Please pick a nickname!',
          color: 'orange',
          icon: (
            <ActionIcon size={'lg'}>
              <InfoCircle size={16} color="white" />
            </ActionIcon>
          ),
        });
      }

      socket.on('receiveChatMessage', (message) => {
        chatStore.addMessage(message);
        scrollChatToBottom();
      });

      return () => {
        socket.off('receiveChatMessage');
      };
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
        sender: gameStore.player,
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
            <Navbar width={{ base: 'auto' }} p={'sm'}>
              <Navbar.Section
                grow
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  maxHeight: '70%',
                  height: '70%',
                }}
                pt="xs"
              >
                <Group style={{ alignItems: 'flex-start' }} mb="xs">
                  <Tooltip
                    position="bottom"
                    withArrow
                    label={t('lobby.gameCodeCopied')}
                    opened={gameCodeClipboard.copied}
                  >
                    <Title
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      order={3}
                      onClick={() =>
                        gameCodeClipboard.copy(gameStore.player.room)
                      }
                    >
                      Lobby #{gameStore.player.room}
                    </Title>
                  </Tooltip>
                  <Tooltip
                    position="bottom"
                    withArrow
                    label={t('lobby.gameCodeCopied')}
                    opened={inviteLinkClipboard.copied}
                  >
                    <Badge
                      style={{ cursor: 'pointer' }}
                      ml="xs"
                      mt={7}
                      onClick={() =>
                        inviteLinkClipboard.copy(`${window.location.href}`)
                      }
                    >
                      Invite Link
                    </Badge>
                  </Tooltip>
                </Group>
                <Group position="apart">
                  <Button
                    onClick={() =>
                      socket.emit('leaveLobby', gameStore.player.room)
                    }
                    leftIcon={<ArrowLeft size={18} />}
                  >
                    {t('lobby.leaveLobby')}
                  </Button>
                  <Button
                    disabled={
                      gameStore.player.role !== Role.CAPTAIN ||
                      gameStore.connectedPlayers.length < minPlayerAmount ||
                      gameStore.hasGameStarted
                    }
                    title={
                      gameStore.player.role !== Role.CAPTAIN
                        ? 'Only the lobby captain can start the game'
                        : gameStore.connectedPlayers.length < minPlayerAmount
                        ? `You need at least ${minPlayerAmount} players in a lobby to start the game`
                        : undefined
                    }
                    onClick={() => gameStore.startGame()}
                    rightIcon={<PlayCard size={18} />}
                    ml={'xs'}
                  >
                    {t('lobby.startGame')}
                  </Button>
                </Group>

                <ScrollArea viewportRef={connectedPlayersViewport}>
                  <Table mt={'md'} mb={'md'}>
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 0 }}>
                          {t('lobby.connectedPlayers')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameStore.connectedPlayers.map((p) => (
                        <tr
                          key={JSON.stringify(p)}
                          style={{ textAlign: 'left' }}
                        >
                          <td style={{ paddingLeft: 0 }}>
                            <Group>
                              <Avatar src={p.avatar} size="lg" />
                              <Text
                                size="lg"
                                color={
                                  p.id === gameStore.player.id ? 'orange' : ''
                                }
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {p.nickname}{' '}
                                {p.role === Role.CAPTAIN && (
                                  <Crown style={{ paddingLeft: '4px' }} />
                                )}
                              </Text>
                            </Group>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Navbar.Section>
              <Navbar.Section>
                <Divider />
              </Navbar.Section>
              <Navbar.Section
                grow
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                  maxHeight: '30%',
                  height: '30%',
                }}
                pt="xs"
              >
                <ScrollArea viewportRef={chatViewport}>
                  <ul className="lobby__chat">
                    {chatStore.messages.map((m, i) => (
                      <li
                        className="lobby__chat__message"
                        key={`${JSON.stringify(m)}-${i}`}
                      >
                        <Text color={m.sender === Role.SYSTEM ? 'orange' : ''}>
                          {m.sender !== Role.SYSTEM
                            ? m.sender.id === gameStore.player.id
                              ? 'You'
                              : m.sender.nickname
                            : m.sender}
                          : {m.message}
                        </Text>
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
                      <Message size={18} />
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
          {gameStore.hasGameStarted && <Game />}
        </AppShell>
        <SettingsModal
          opened={settingsStore.isSettingsModalOpened}
          onClose={() => settingsStore.setIsSettingsModalOpened(false)}
        />
        <InstructionsModal
          opened={settingsStore.isInstructionsModalOpened}
          onClose={() => settingsStore.setIsInstructionsModalOpened(false)}
        />
        <Affix position={{ bottom: 20, right: 20 }}>
          <ActionIcon
            size="lg"
            onClick={() => settingsStore.setIsInstructionsModalOpened(true)}
          >
            <QuestionMark size={18} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            onClick={() => settingsStore.setIsSettingsModalOpened(true)}
          >
            <Settings size={18} />
          </ActionIcon>
        </Affix>
      </div>
    );
  })
);

export default Lobby;
