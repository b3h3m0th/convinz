/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { gameStore } from '@convinz/stores';
import { inject, observer } from 'mobx-react';
import React from 'react';

export interface GameProps {}

const Game: React.FC<GameProps> = inject(gameStore.storeKey)(
  observer(({}: GameProps) => {
    return (
      <div className="game">
        <div>game</div>
      </div> 
    );
  })
);

export default Game;
