import { defaultPlayer, Player, Role } from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { IStore } from '../interfaces';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  protected initialPlayer = defaultPlayer;
  @observable player: Player = this.initialPlayer;
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

    socket.on('joinedLobby', (result) => {
      if (result.error) return;

      this.setPlayer(result.player);
      this.setHasJoinedLobby(true);
      this.setConnectedPlayersAndUpdateSelfPlayer(result.players);
      console.log(`joined lobby: ${result.gameCode}`);
    });

    socket.on('leftLobby', (result) => {
      if (result.error) return;

      this.setPlayer(result.player);
      gameStore.setConnectedPlayersAndUpdateSelfPlayer(result.players);

      if (result.player) {
        gameStore.setHasJoinedLobby(false);
        gameStore.setHasGameStarted(false);
      }
    });

    socket.on('startedGame', (gameCode) => {
      this.hasGameStarted = true;
    });
  }

  @action setPlayer(player: Player | undefined) {
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
    socket.emit('startGame', this.player.room);
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
