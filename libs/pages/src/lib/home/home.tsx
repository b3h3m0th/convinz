/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import './home.scss';
import { GameAccessionType, GameCode } from '@convinz/shared/types';
import { gameStore, settingsStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import { socket } from '@convinz/socket';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Group,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  Edit,
  Hash,
  QuestionMark,
  RotateClockwise,
  Settings,
} from 'tabler-icons-react';
import { gameCodeLength, getAvatar } from '@convinz/shared/util';
import {
  GameConfigModal,
  InstructionsModal,
  SettingsModal,
} from '@convinz/components';
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
    const [avatarSeed, setAvatarSeed] = useState<number>(Math.random());

    useEffect(() => {
      if (gameStore.hasJoinedLobby && gameStore.player.room)
        navigate(`${ROUTES.game}/${gameStore.player.room}`);
    }, [gameStore.hasJoinedLobby, gameStore.player.room]);

    const onJoinGame = () => {
      if (gameStore.player.room)
        socket.emit(
          'joinLobby',
          gameStore.player.room,
          gameStore.player.nickname,
          getAvatar(avatarSeed),
          GameAccessionType.GAME_CODE
        );
    };

    const onCreateGame = () => {
      socket.emit(
        'createLobby',
        gameStore.player.nickname,
        getAvatar(avatarSeed),
        {
          roundsAmount: settingsStore.roundsAmount,
          explainTime: settingsStore.explainTime,
          voteTime: settingsStore.voteTime,
        }
      );
    };

    return (
      <div className="home">
        <div className="home__content">
          <Title mb="xs" align="center">
            Convinz
          </Title>
          <Text mb="lg" align="center">
            {t('home.subheading')}
          </Text>
          <Center inline={false} sx={{ flexDirection: 'column' }}>
            <Avatar
              size={100}
              radius="lg"
              src={getAvatar(avatarSeed)}
              sx={{ border: '2px solid #ced4da' }}
              mb="xs"
            />
            <ActionIcon
              size="xs"
              onClick={() => setAvatarSeed((prev) => Math.random())}
            >
              <RotateClockwise />
            </ActionIcon>
          </Center>
          <TextInput
            icon={<Hash size={14} />}
            label={t('home.gameCode')}
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
            label={t('home.nickname')}
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
          <Center mt="xs">
            <ActionIcon size="lg">
              <Edit
                onClick={() => settingsStore.setIsGameConfigModalOpened(true)}
              />
            </ActionIcon>
            <ActionIcon size="lg">
              <Settings
                onClick={() => settingsStore.setIsSettingsModalOpened(true)}
              />
            </ActionIcon>
            <ActionIcon size="lg">
              <QuestionMark
                onClick={() => settingsStore.setIsInstructionsModalOpened(true)}
              />
            </ActionIcon>
          </Center>
          <SettingsModal
            opened={settingsStore.isSettingsModalOpened}
            onClose={() => settingsStore.setIsSettingsModalOpened(false)}
          />
          <InstructionsModal
            opened={settingsStore.isInstructionsModalOpened}
            onClose={() => settingsStore.setIsInstructionsModalOpened(false)}
          />
          <GameConfigModal
            opened={settingsStore.isGameConfigModalOpened}
            onClose={() => settingsStore.setIsGameConfigModalOpened(false)}
          />
        </div>
      </div>
    );
  })
);

export default Home;
