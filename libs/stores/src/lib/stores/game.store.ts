import { defaultPlayer, Player, Role } from '@convinz/shared/types';
import { socket } from '@convinz/socket';
import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { IStore } from '../interfaces';
import { chatStore } from './chat.store';

export class GameStore implements IStore {
  storeKey = 'gameStore' as const;
  protected initialPlayer = defaultPlayer;
  @observable player: Player = this.initialPlayer;
  @observable isConnected = false;
  @observable hasJoinedLobby = false;
  @observable hasGameStarted = false;
  @observable connectedPlayers: Player[] = [];
  @observable hasSubmitted = false;

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

      chatStore.addMessage({
        lobby: this.player.room,
        sender: Role.SYSTEM,
        message: `${
          this.player.id === result?.joinedPlayer?.id
            ? 'You'
            : result?.joinedPlayer?.nickname || 'Somebody'
        } joined the lobby`,
      });
    });

    socket.on('leftLobby', (result) => {
      if (result.error) return;

      this.setPlayer(result.player);
      gameStore.setConnectedPlayersAndUpdateSelfPlayer(result.players);

      if (result.player) {
        gameStore.setHasJoinedLobby(false);
        gameStore.setHasGameStarted(false);
        chatStore.resetMessages();
      }

      chatStore.addMessage({
        lobby: this.player.room,
        sender: Role.SYSTEM,
        message: `${result?.leftPlayer?.nickname || 'Somebody'} left the lobby`,
      });
    });

    socket.on('startedGame', (result) => {
      this.setHasGameStarted(true);

      chatStore.addMessage({
        lobby: this.player.room,
        sender: Role.SYSTEM,
        message: `${result.starterPlayer.nickname} started the game`,
      });
    });

    socket.on('receivedSubmission', (result) => {
      console.log(result.submissions);
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

  @action setHasSubmitted(value: boolean) {
    this.hasSubmitted = value;
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
