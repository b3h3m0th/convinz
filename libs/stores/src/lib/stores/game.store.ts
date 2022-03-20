import type { GameCode } from '@convinz/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  @observable gameCode: GameCode = null;
  @observable nickname = '';
  @observable isConnected = false;
  @observable hasJoinedLobby = false;
  @observable connectedPlayers: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setGameCode(code: GameCode) {
    this.gameCode = code;
  }

  @action setNickname(value: string) {
    this.nickname = value;
  }

  @action setIsConnected(value: boolean) {
    this.isConnected = value;
  }

  @action setHasJoinedLobby(value: boolean) {
    this.hasJoinedLobby = value;
  }

  @action setConnectedPlayers(players: string[]) {
    this.connectedPlayers = players;
  }

  @action addConnectedPlayer(player: string) {
    this.connectedPlayers.push(player);
  }
}

export const gameStore = new GameStore();
