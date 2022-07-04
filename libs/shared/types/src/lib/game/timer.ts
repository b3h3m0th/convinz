import { EventEmitter } from 'events';

export type ExplainTime = 30 | 45 | 60 | 120 | 150 | 180;
export type VoteTime = 30 | 45 | 60 | 120 | 150 | 180;
export const defaultExplainTime: ExplainTime = 30;
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
