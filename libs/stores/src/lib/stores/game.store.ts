import type { GameCode } from '@convinz/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  @observable gameCode: GameCode = null;
  @observable isConnected = false;
  @observable hasJoinedLobby = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setGameCode(code: GameCode) {
    this.gameCode = code;
  }

  @action setIsConnected(value: boolean) {
    this.isConnected = value;
  }

  @action setHasJoinedLobby(value: boolean) {
    this.hasJoinedLobby = value;
  }
}

export const gameStore = new GameStore();
