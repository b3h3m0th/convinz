/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import './game.scss';
import { PlayerActionStatus, Submission } from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { gameStore } from '@convinz/stores';
import {
  Button,
  Loader,
  RadioGroup,
  Text,
  TextInput,
  Radio,
  Blockquote,
  Group,
  Divider,
} from '@mantine/core';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { QuestionMark } from 'tabler-icons-react';

export interface GameProps {}

const Game: React.FC<GameProps> = inject(gameStore.storeKey)(
  observer(({}: GameProps) => {
    const [currentQuestion, setCurrentQuestion] = useState<string>();
    const [solution, setSolution] = useState<string | null>();
    const [votingSubmissions, setVotingSubmissions] = useState<Submission[]>();
    const [explanation, setExplanation] = useState<string>('');

    useEffect(() => {
      socket.emit('requestRound', gameStore.player.room);

      socket.on('receivedRound', (result) => {
        setSolution(result.solution);
        setCurrentQuestion(result.question);
        gameStore.setPlayerActionStatus(PlayerActionStatus.explaining);
      });

      socket.on('startedVoting', (result) => {
        setVotingSubmissions(result.submissions);
        console.log(result.submissions);
        gameStore.setPlayerActionStatus(PlayerActionStatus.voting);
      });

      return () => {
        socket.off('receivedRound');
        socket.off('startedVoting');
      };
    }, []);

    const submitExplanation = () => {
      socket.emit('submitExplanation', gameStore.player.room, explanation);
      setExplanation('');
    };

    return (
      <div className="game">
        {gameStore.playerActionStatus === PlayerActionStatus.loadingQuestion ? (
          <div>Wating for a Question</div>
        ) : gameStore.playerActionStatus ===
          PlayerActionStatus.waitingForOtherPlayers ? (
          <div className="game__waiting-for-other-players">
            <Loader mb="sm" />
            <Text>Wait for the other players to submit their explanation</Text>
          </div>
        ) : gameStore.playerActionStatus === PlayerActionStatus.voting ? (
          <div>
            <h1>What explanation is most convinzing?</h1>
            <h3>{currentQuestion}</h3>

            {votingSubmissions?.map((s) => {
              return (
                <>
                  <Divider my="xs" />
                  <Group key={`-${s}`}>
                    <Button>Vote</Button>
                    <Blockquote cite={`-${s.player.nickname}`}>
                      {s.explanation}
                    </Blockquote>
                  </Group>
                </>
              );
            })}
          </div>
        ) : (
          <div>
            <h1>Convinz your friends!</h1>
            <h3>{currentQuestion}</h3>

            <TextInput
              maxLength={200}
              icon={<QuestionMark size={18} />}
              value={solution ?? `${explanation}`}
              onChange={(e) => setExplanation(e.target.value)}
              mb="xs"
              size="lg"
              disabled={solution !== null}
            />
            <Button
              disabled={solution !== null}
              onClick={() => submitExplanation()}
              mr="xs"
            >
              Submit Explanation
            </Button>
            {solution && (
              <Text mt="sm" color="orange">
                You have the solution. Don't let the other players know!
              </Text>
            )}
          </div>
        )}
      </div>
    );
  })
);

export default Game;
