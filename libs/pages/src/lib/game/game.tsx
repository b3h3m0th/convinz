/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import './game.scss';
import {
  ActionTimer,
  Player,
  PlayerActionStatus,
  Submission,
  VoteResult,
} from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { gameStore, settingsStore } from '@convinz/stores';
import {
  Button,
  Text,
  TextInput,
  Blockquote,
  Group,
  Divider,
  Avatar,
  AvatarsGroup,
  RingProgress,
  Center,
} from '@mantine/core';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { QuestionMark } from 'tabler-icons-react';

export interface GameProps {}

const Game: React.FC<GameProps> = inject(
  gameStore.storeKey,
  settingsStore.storeKey
)(
  observer(({}: GameProps) => {
    const [currentQuestion, setCurrentQuestion] = useState<string>();
    const [solution, setSolution] = useState<string | null>();
    const [votingSubmissions, setVotingSubmissions] = useState<Submission[]>();
    const [gameResults, setGameResults] = useState<VoteResult[]>();
    const [explanation, setExplanation] = useState<string>('');
    const [explainTimer, setExplainTimer] = useState<ActionTimer>({
      totalTime: settingsStore.explainTime,
      timeLeft: settingsStore.explainTime,
    });
    const [voteTimer, setVoteTimer] = useState<ActionTimer>({
      totalTime: settingsStore.voteTime,
      timeLeft: settingsStore.voteTime,
    });

    useEffect(() => {
      socket.emit('requestRound', gameStore.player.room);

      socket.on('receivedRound', (result) => {
        setSolution(result.solution);
        setCurrentQuestion(result.question);
        setExplainTimer({
          totalTime: result.totalTime,
          timeLeft: result.totalTime,
        });
        gameStore.setPlayerActionStatus(PlayerActionStatus.explaining);
      });

      socket.on('explainTimerTickExpired', (result) => {
        if (
          result.timeLeft === 0 &&
          gameStore.playerActionStatus === PlayerActionStatus.explaining
        ) {
          submitExplanation('Sorry I ran out of time');
        }

        setExplainTimer({
          totalTime: result.totalTime,
          timeLeft: result.timeLeft,
        });
      });

      socket.on('voteTimerTickExpired', (result) => {
        if (
          result.timeLeft === 0 &&
          gameStore.playerActionStatus === PlayerActionStatus.voting
        ) {
          //
        }

        setVoteTimer({
          totalTime: result.totalTime,
          timeLeft: result.timeLeft,
        });
      });

      socket.on('startedVoting', (result) => {
        setVotingSubmissions(result.submissions);
        gameStore.setPlayerActionStatus(PlayerActionStatus.voting);
      });

      socket.on('updatedVoting', (result) => {
        setVotingSubmissions(result.submissions);
      });

      socket.on('gameEnded', (result) => {
        setGameResults(result.gameResults);
        gameStore.setPlayerActionStatus(PlayerActionStatus.viewingResults);
      });

      return () => {
        socket.off('receivedRound');
        socket.off('explainTimerTickExpired');
        socket.off('startedVoting');
        socket.off('voteTimerTickExpired');
        socket.off('updatedVoting');
      };
    }, []);

    const submitExplanation = (explanation: string) => {
      if (explanation.length < 1) return;

      socket.emit('submitExplanation', gameStore.player.room, explanation);
      setExplanation('');
    };

    const submitVote = (voteForPlayer: Player) => {
      socket.emit('submitVote', gameStore.player.room, voteForPlayer);
      gameStore.setPlayerActionStatus(
        PlayerActionStatus.waitingForOtherPlayersToVote
      );
    };

    return (
      <div className="game">
        {gameStore.playerActionStatus === PlayerActionStatus.loadingQuestion ? (
          <div>Wating for a Question</div>
        ) : gameStore.playerActionStatus ===
          PlayerActionStatus.waitingForOtherPlayersToSubmitExplanation ? (
          <div className="game__waiting-for-other-players">
            <RingProgress
              size={75}
              thickness={8}
              sections={[
                {
                  value: (explainTimer.timeLeft / explainTimer.totalTime) * 100,
                  color: 'orange',
                },
              ]}
              label={
                <Text color="orange" weight={500} align="center">
                  {explainTimer.timeLeft}
                </Text>
              }
              mb="xs"
            />
            <Text>Wait for the other players to submit their explanation</Text>
          </div>
        ) : [
            PlayerActionStatus.voting,
            PlayerActionStatus.waitingForOtherPlayersToVote,
          ].includes(gameStore.playerActionStatus) ? (
          <div>
            <Group sx={{ justifyContent: 'space-between' }}>
              <h1>Which explanation is the most convinzing?</h1>
              <RingProgress
                size={75}
                thickness={8}
                sections={[
                  {
                    value: (voteTimer.timeLeft / voteTimer.totalTime) * 100,
                    color: 'orange',
                  },
                ]}
                label={
                  <Text color="orange" weight={500} align="center">
                    {voteTimer.timeLeft}
                  </Text>
                }
              />
            </Group>
            <h3>{currentQuestion}</h3>

            {votingSubmissions?.map((s) => {
              return (
                <div key={`-${s.player.id}-${s.explanation}`}>
                  <Divider my="xs" />
                  <Group>
                    <Blockquote
                      icon={<Avatar src={s.player.avatar} />}
                      cite={`-${s.player.nickname}`}
                      sx={{ width: '50%' }}
                    >
                      {s.explanation}
                    </Blockquote>
                    <Group>
                      <Button
                        disabled={
                          s.player.id === gameStore.player.id ||
                          gameStore.playerActionStatus ===
                            PlayerActionStatus.waitingForOtherPlayersToVote
                        }
                        title={
                          s.player.id === gameStore.player.id
                            ? 'You cannot vote for yourself'
                            : gameStore.playerActionStatus ===
                              PlayerActionStatus.waitingForOtherPlayersToVote
                            ? 'You have already voted'
                            : ''
                        }
                        onClick={() => submitVote(s.player)}
                      >
                        Vote
                      </Button>
                      <Group spacing="xs">
                        {s.votes.map((v) => (
                          <Avatar key={v.id} size="md" src={v.avatar} />
                        ))}
                      </Group>
                    </Group>
                  </Group>
                </div>
              );
            })}
          </div>
        ) : gameStore.playerActionStatus ===
          PlayerActionStatus.viewingResults ? (
          <Group direction="column" sx={{ height: '100%' }}>
            <h1 style={{ alignSelf: 'start' }}>Results</h1>
            <Group position="center" grow sx={{ width: '100%' }}>
              <div className="game__winners-podium">
                <div className="game__winners-podium__rank rank-2">
                  <Avatar
                    src={gameResults && gameResults[0].player.avatar}
                    size="lg"
                  />
                  <Text size="xl" weight={700} color="white">
                    2
                  </Text>
                </div>
                <div className="game__winners-podium__rank rank-1">
                  <Avatar
                    src={gameResults && gameResults[0].player.avatar}
                    size="lg"
                  />
                  <Text size="xl" weight={700} color="white">
                    1
                  </Text>
                </div>
                <div className="game__winners-podium__rank rank-3">
                  <Avatar
                    src={gameResults && gameResults[0].player.avatar}
                    size="lg"
                  />
                  <Text size="xl" weight={700} color="white">
                    3
                  </Text>
                </div>
              </div>
            </Group>
            {JSON.stringify(gameResults)}
          </Group>
        ) : (
          <div>
            <Group sx={{ justifyContent: 'space-between' }}>
              <h1>Convinz your friends!</h1>
              <RingProgress
                size={75}
                thickness={8}
                sections={[
                  {
                    value:
                      (explainTimer.timeLeft / explainTimer.totalTime) * 100,
                    color: 'orange',
                  },
                ]}
                label={
                  <Text color="orange" weight={500} align="center">
                    {explainTimer.timeLeft}
                  </Text>
                }
              />
            </Group>
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
            <Button onClick={() => submitExplanation(explanation)} mr="xs">
              Submit Explanation
            </Button>
          </div>
        )}
      </div>
    );
  })
);

export default Game;
