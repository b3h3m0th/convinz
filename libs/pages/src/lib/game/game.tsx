/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import './game.scss';
import {
  Player,
  PlayerActionStatus,
  Round,
  Submission,
  VoteResult,
} from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { gameStore } from '@convinz/stores';
import {
  Button,
  Loader,
  Text,
  TextInput,
  Blockquote,
  Group,
  Divider,
  Avatar,
  AvatarsGroup,
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
    const [gameResults, setGameResults] = useState<VoteResult[]>();
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
        socket.off('startedVoting');
        socket.off('updatedVoting');
      };
    }, []);

    const submitExplanation = () => {
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
            <Loader mb="sm" />
            <Text>Wait for the other players to submit their explanation</Text>
          </div>
        ) : [
            PlayerActionStatus.voting,
            PlayerActionStatus.waitingForOtherPlayersToVote,
          ].includes(gameStore.playerActionStatus) ? (
          <div>
            <h1>Which explanation is the most convinzing?</h1>
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
                      <AvatarsGroup limit={votingSubmissions.length}>
                        {s.votes.map((v) => (
                          <Avatar key={v.id} size="sm" src={v.avatar} />
                        ))}
                      </AvatarsGroup>
                    </Group>
                  </Group>
                </div>
              );
            })}
          </div>
        ) : gameStore.playerActionStatus ===
          PlayerActionStatus.viewingResults ? (
          <div>
            <h1>Results</h1>
            {JSON.stringify(gameResults)}
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
