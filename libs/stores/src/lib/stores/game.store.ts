import type { GameCode } from '@convinz/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  @observable gameCode: GameCode = null;

  constructor() {
    makeAutoObservable(this);
  }

  @action setGameCode(code: GameCode) {
    this.gameCode = code;
  }
}

export const gameStore = new GameStore();
