/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { PlayerActionStatus } from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { gameStore } from '@convinz/stores';
import { Button, TextInput } from '@mantine/core';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { QuestionMark } from 'tabler-icons-react';

export interface GameProps {}

const Game: React.FC<GameProps> = inject(gameStore.storeKey)(
  observer(({}: GameProps) => {
    const [currentQuestion, setCurrentQuestion] = useState<string>();
    const [explanation, setExplanation] = useState<string>('');

    useEffect(() => {
      socket.emit('requestRound', gameStore.player.room);

      socket.on('receivedRound', (result) => {
        setCurrentQuestion(result.question);
        gameStore.setPlayerActionStatus(PlayerActionStatus.explaining);
      });

      return () => {
        socket.off('receivedRound');
      };
    }, []);

    const submitExplanation = () => {
      socket.emit('submitExplanation', gameStore.player.room, explanation);
      setExplanation('');
    };

    return (
      <div className="game">
        <h1>Convinz</h1>

        {gameStore.playerActionStatus === PlayerActionStatus.loadingQuestion ? (
          <div>Wating for a Question</div>
        ) : gameStore.playerActionStatus ===
          PlayerActionStatus.waitingForOtherPlayers ? (
          <div>Wait for the other players to submit their explanation</div>
        ) : gameStore.playerActionStatus === PlayerActionStatus.voting ? (
          <div>Voting</div>
        ) : (
          <div>
            <h3>{currentQuestion}?</h3>

            <TextInput
              maxLength={200}
              icon={<QuestionMark size={18} />}
              value={`${explanation}`}
              onChange={(e) => setExplanation(e.target.value)}
              mb="xs"
              size="lg"
            />
            <Button onClick={() => submitExplanation()} mr="xs">
              Submit Explanation
            </Button>
          </div>
        )}
      </div>
    );
  })
);

export default Game;
