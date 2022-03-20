/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import './home.scss';
import type { GameCode } from '@convinz/shared/types';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@convinz/router';
import { socket } from '@convinz/socket';

socket.on('connect', () => {
  gameStore.setIsConnected(true);
  console.log(`connected with id: ${socket.id}`);
});

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
          gameStore.nickname,
          (result) => {
            if (!result.error) {
              gameStore.setHasJoinedLobby(true);
              gameStore.setConnectedPlayers(result.nicknames);
              console.log(`joined lobby: ${result.gameCode}`);
              gameStore.setGameCode(result.gameCode);
            }
          }
        );
    };

    const onCreateGame = () => {
      socket.emit('create', gameStore.nickname, (result) => {
        if (!result.error) {
          gameStore.setHasJoinedLobby(true);
          gameStore.setConnectedPlayers(result.nicknames);
          console.log(`created lobby: ${result.gameCode}`);
          gameStore.setGameCode(result.gameCode);
        }
      });
    };

    useEffect(() => {
      if (gameStore.hasJoinedLobby && gameStore.gameCode)
        navigate(`/${ROUTES.game}/${gameStore.gameCode}`);
    }, [gameStore.hasJoinedLobby]);

    return (
      <div className="home">
        <h1>home</h1>
        <div className="home__content">
          <label htmlFor="gameCode">Game Code</label>
          <input
            id="gameCode"
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
          <br />
          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            type="text"
            className="home__content__nickname-input"
            value={gameStore.nickname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              gameStore.setNickname(e.target.value)
            }
          />
          <br />
          <button onClick={() => onJoinGame()}>Join Game</button>
          <button onClick={() => onCreateGame()}>Create Game</button>
        </div>
      </div>
    );
  })
);

export default Home;
