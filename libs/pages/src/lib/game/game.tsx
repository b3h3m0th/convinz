/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
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

      socket.on('receivedRound', (result) =>
        setCurrentQuestion(result.question)
      );

      return () => {
        socket.off('receivedRound');
      };
    }, []);

    return (
      <div className="game">
        <h1>Convinz</h1>
        {!currentQuestion ? (
          <div>Wating for a Question</div>
        ) : gameStore.hasSubmitted ? (
          <div>Wait for the other players to submit their explanation</div>
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
            <Button
              onClick={() =>
                socket.emit(
                  'submitExplanation',
                  gameStore.player.room,
                  explanation
                )
              }
              mr="xs"
            >
              Submit Explanation
            </Button>
          </div>
        )}
      </div>
    );
  })
);

export default Game;
