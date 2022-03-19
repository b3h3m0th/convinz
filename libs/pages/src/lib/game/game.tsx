import React from 'react';
import './game.scss';
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GameProps {}

export const Game: React.FC<GameProps> = inject(gameStore.storeKey)(
  // eslint-disable-next-line no-empty-pattern
  observer(({}: GameProps) => {
    return (
      <div className="game">
        <h1>game</h1>
      </div>
    );
  })
);

export default Game;
