/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import './home.scss';
import { GameAccessionType, GameCode } from '@convinz/shared/types';
import { gameStore, settingsStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import { socket } from '@convinz/socket';
import { ActionIcon, Button, Text, TextInput, Title } from '@mantine/core';
import { Hash, Settings } from 'tabler-icons-react';
import { gameCodeLength } from '@convinz/shared/util';
import { SettingsModal } from '@convinz/components';
import { useTranslation } from 'react-i18next';

/* eslint-disable-next-line */
export interface HomeProps {}

export const Home: React.FC<HomeProps> = inject(
  gameStore.storeKey,
  settingsStore.storeKey
)(
  observer((props: HomeProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onJoinGame = () => {
      if (gameStore.player.room)
        socket.emit(
          'joinLobby',
          gameStore.player.room,
          gameStore.player.nickname,
          GameAccessionType.GAME_CODE
        );
    };

    const onCreateGame = () => {
      socket.emit('createLobby', gameStore.player.nickname);
    };

    useEffect(() => {
      if (gameStore.hasJoinedLobby && gameStore.player.room)
        navigate(`${ROUTES.game}/${gameStore.player.room}`);
    }, [gameStore.hasJoinedLobby, gameStore.player.room]);

    return (
      <div className="home">
        <div className="home__content">
          <Title mb="xs">Convinz</Title>
          <Text mb="md">{t('home.subheading')} </Text>
          <TextInput
            icon={<Hash size={14} />}
            label="Game Code"
            placeholder={'X'.repeat(gameCodeLength)}
            maxLength={gameCodeLength}
            value={`${
              (gameStore.player.room as string)
                ? (gameStore.player.room as string)
                : ''
            }`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              gameStore.setPlayer({
                ...gameStore.player,
                room: e.currentTarget.value.toUpperCase() as GameCode,
              })
            }
          />
          <TextInput
            label="Nickname"
            type="text"
            className="home__content__nickname-input"
            value={gameStore.player.nickname}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              gameStore.setPlayer({
                ...gameStore.player,
                nickname: e.target.value,
              });
            }}
          />
          <br />
          <Button
            disabled={
              !(
                ((gameStore.player.room as string) ?? '').length ===
                gameCodeLength
              ) || !gameStore.player?.nickname
            }
            onClick={() => onJoinGame()}
            mr="xs"
          >
            {t('home.joinGame')}
          </Button>
          <Button
            disabled={!gameStore.player?.nickname}
            onClick={() => onCreateGame()}
            ml="xs"
          >
            {t('home.createGame')}
          </Button>
          <ActionIcon size={'lg'} mt="xs">
            <Settings
              onClick={() => settingsStore.setIsSettingsModalOpened(true)}
            />
          </ActionIcon>
          <SettingsModal
            opened={settingsStore.isSettingsModalOpened}
            onClose={() => settingsStore.setIsSettingsModalOpened(false)}
          />
        </div>
      </div>
    );
  })
);

export default Home;
