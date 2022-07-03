export type ExplainTime = 30 | 45 | 60 | 120 | 150 | 180;
export type VoteTime = 30 | 45 | 60 | 120 | 150 | 180;
export const defaultExplainTime: ExplainTime = 30;
export const defaultVoteTime: ExplainTime = 30;

export type ActionTimer = {
  totalTime: ExplainTime;
  timeLeft: number;
};
