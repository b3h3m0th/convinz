/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { socket } from '@convinz/socket';
import { gameStore } from '@convinz/stores';
import { Button, Textarea } from '@mantine/core';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { QuestionMark } from 'tabler-icons-react';

export interface GameProps {}

const Game: React.FC<GameProps> = inject(gameStore.storeKey)(
  observer(({}: GameProps) => {
    const [currentTerm, setCurrentTerm] = useState<string>();
    const [explanation, setExplanation] = useState<string>('');

    useEffect(() => {
      socket.emit('requestRound', gameStore.player.room);

      socket.on('receiveRound', (result) => setCurrentTerm(result.term));

      return () => {
        socket.off('receiveRound');
      };
    }, []);

    return (
      <div className="game">
        <h1>Convinz</h1>
        {!currentTerm ? (
          <div>Wating for a Term</div>
        ) : (
          <div>
            <p>What is a...</p>
            <h3>{currentTerm}?</h3>

            <Textarea
              icon={<QuestionMark size={14} />}
              value={`${explanation}`}
              onChange={(e) => setExplanation(e.target.value)}
              mb="xs"
            />
            <Button onClick={() => console.log(explanation)} mr="xs">
              Submit Explanation
            </Button>
          </div>
        )}
      </div>
    );
  })
);

export default Game;
