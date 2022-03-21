import { Player, Role } from '@convinz/shared/types';
import type { GameCode } from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  @observable gameCode: GameCode = null;
  @observable nickname = '';
  @observable player: Player = new Player('', '', '', Role.MEMBER);
  @observable isConnected = false;
  @observable hasJoinedLobby = false;
  @observable connectedPlayers: Player[] = [];

  constructor() {
    makeAutoObservable(this);

    this.onSocketListeners();
  }

  onSocketListeners() {
    socket.on('connect', () => {
      this.setIsConnected(true);
      console.log(`connected with id: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      this.setIsConnected(false);
      console.log(`disconnected`);
    });

    socket.on('joined', (players) => {
      console.log(players);
      this.setConnectedPlayers(players);
    });

    socket.on('left', (players) => {
      console.log(players);
      this.setConnectedPlayers(players);
    });
  }

  @action setGameCode(code: GameCode) {
    this.gameCode = code;
  }

  @action setNickname(value: string) {
    this.nickname = value;
  }

  @action setPlayer(player: Player) {
    this.player = player;
  }

  @action setIsConnected(value: boolean) {
    this.isConnected = value;
  }

  @action setHasJoinedLobby(value: boolean) {
    this.hasJoinedLobby = value;
  }

  @action setConnectedPlayers(players: Player[]) {
    this.connectedPlayers = players;
  }

  @action addConnectedPlayer(player: Player) {
    this.connectedPlayers.push(player);
  }
}

export const gameStore = new GameStore();
