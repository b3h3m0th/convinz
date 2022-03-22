/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import './home.scss';
import { GameAccessionType, GameCode } from '@convinz/shared/types';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import { socket } from '@convinz/socket';
import { Button, Text, TextInput, Title } from '@mantine/core';

/* eslint-disable-next-line */
export interface HomeProps {}

export const Home: React.FC<HomeProps> = inject(gameStore.storeKey)(
  observer((props: HomeProps) => {
    const navigate = useNavigate();

    const onJoinGame = () => {
      if (gameStore.gameCode)
        socket.emit(
          'join',
          gameStore.gameCode,
          gameStore.player.nickname,
          GameAccessionType.GAME_CODE,
          (result) => {
            if (!result.error) {
              gameStore.setPlayer(result.player);
              gameStore.setHasJoinedLobby(true);
              gameStore.setConnectedPlayers(result.players);
              gameStore.setGameCode(result.gameCode);
              console.log(`joined lobby: ${result.gameCode}`);
            }
          }
        );
    };

    const onCreateGame = () => {
      socket.emit('create', gameStore.player.nickname, (result) => {
        if (!result.error) {
          gameStore.setPlayer(result.player);
          gameStore.setHasJoinedLobby(true);
          gameStore.setConnectedPlayers(result.players);
          gameStore.setGameCode(result.gameCode);
          console.log(`created lobby: ${result.gameCode}`);
        }
      });
    };

    useEffect(() => {
      if (gameStore.hasJoinedLobby && gameStore.gameCode)
        navigate(`${ROUTES.game}/${gameStore.gameCode}`);
    }, [gameStore.hasJoinedLobby]);

    return (
      <div className="home">
        <div className="home__content">
          <Title mb="xs">Convinz</Title>
          <Text mb="md">Win by inventing shit</Text>
          <TextInput
            label="Game Code"
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
          <TextInput
            label="Nickname"
            type="text"
            className="home__content__nickname-input"
            value={gameStore.player.nickname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              gameStore.setPlayer({
                ...gameStore.player,
                nickname: e.target.value,
              })
            }
          />
          <br />
          <Button onClick={() => onJoinGame()} mr="xs">
            Join Game
          </Button>
          <Button onClick={() => onCreateGame()} ml="xs">
            Create Game
          </Button>
        </div>
      </div>
    );
  })
);

export default Home;
