import { Player, Role } from '@convinz/shared/types';
import type { GameCode } from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { IStore } from '../interfaces';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  @observable gameCode: GameCode = null;
  @observable player: Player = new Player('', '', '', Role.MEMBER);
  @observable isConnected = false;
  @observable hasJoinedLobby = false;
  @observable hasGameStarted = false;
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

    socket.on('joined', (result) => {
      if (result.error) return;

      this.setPlayer(result.player);
      this.setHasJoinedLobby(true);
      this.setGameCode(result.gameCode);
      this.setConnectedPlayersAndUpdateSelfPlayer(result.players);
      console.log(`joined lobby: ${result.gameCode}`);
    });

    socket.on('left', (result) => {
      if (result.error) return;

      gameStore.setHasJoinedLobby(false);
      gameStore.setHasGameStarted(false);
      gameStore.setConnectedPlayersAndUpdateSelfPlayer(result.players);
    });

    socket.on('started', (gameCode) => {
      this.hasGameStarted = true;
    });
  }

  @action setGameCode(code: GameCode) {
    this.gameCode = code;
  }

  @action setPlayer(player: Player) {
    this.player = player ?? this.player;
  }

  @action setIsConnected(value: boolean) {
    this.isConnected = value;
  }

  @action setHasJoinedLobby(value: boolean) {
    this.hasJoinedLobby = value;
  }

  @action setHasGameStarted(value: boolean) {
    this.hasGameStarted = value;
  }

  @action startGame() {
    socket.emit('start', this.gameCode);
  }

  @action setConnectedPlayersAndUpdateSelfPlayer(players: Player[]) {
    this.connectedPlayers = players;

    const self = toJS(this.connectedPlayers).filter(
      (p) => p.id === this.player.id
    )[0];

    self && this.setPlayer(self);
  }

  @action addConnectedPlayer(player: Player) {
    this.connectedPlayers.push(player);
  }
}

export const gameStore = new GameStore();
