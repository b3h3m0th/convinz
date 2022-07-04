import { EventEmitter } from 'events';

export const explainTimes = [30, 45, 60, 120, 150, 180] as const;
export type ExplainTime = typeof explainTimes[number];
export const defaultExplainTime: ExplainTime = 30;

export const voteTimes = [30, 45, 60, 120, 150, 180] as const;
export type VoteTime = typeof voteTimes[number];
export const defaultVoteTime: ExplainTime = 30;

export type ActionTimer = {
  totalTime: ExplainTime;
  timeLeft: number;
};

export declare interface VoteTimerEmitter {
  on(event: 'expired', listener: () => void): this;
  on(event: string, listener: () => any): this;
  emit(event: 'expired'): boolean;
}

export class VoteTimerEmitter extends EventEmitter {
  expired() {
    this.emit('expired');
  }
}
