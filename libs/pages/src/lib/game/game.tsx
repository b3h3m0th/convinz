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
  Avatar,
  Tooltip,
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
      if (explanation.length < 1) return;

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
            <h1>Which explanation is the most convinzing?</h1>
            <h3>{currentQuestion}</h3>

            {votingSubmissions?.map((s) => {
              return (
                <div key={`-${s.player.id}-${s.explanation}`}>
                  <Divider my="xs" />
                  <Group>
                    {s.player.id === gameStore.player.id ? (
                      <Tooltip
                        withArrow
                        label={'You cannot vote for yourself'}
                        transition="fade"
                        transitionDuration={200}
                      >
                        <Button disabled>Vote</Button>
                      </Tooltip>
                    ) : (
                      <Button>Vote</Button>
                    )}
                    <Blockquote
                      icon={<Avatar src={s.player.avatar} />}
                      cite={`-${s.player.nickname}`}
                    >
                      {s.explanation}
                    </Blockquote>
                  </Group>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h1>Convinz your friends!</h1>
            <h3>{currentQuestion}</h3>
            {solution && (
              <>
                <Text>Here's the correct solution:</Text>
                <Text size="xl" color="orange">
                  {solution}
                </Text>
                <Text mb="xs">
                  Please rephrase the solution below for the other players so
                  that it appears as if it was originally written by you.
                </Text>
              </>
            )}
            <TextInput
              maxLength={200}
              icon={<QuestionMark size={18} />}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              mb="xs"
              size="lg"
              placeholder={solution ?? undefined}
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
