import {
  GameCode,
  Lobby,
  LobbyCreateConfig,
  Player,
  Players,
  RoundsAmount,
} from '@convinz/shared/types';

export class Lobbies extends Array<Lobby> {
  private static _instance: Lobbies;

  private constructor() {
    super();
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  create(gameCode: string, players: Player[], config: LobbyCreateConfig) {
    const lobby = new Lobby(
      gameCode,
      [],
      new Players(gameCode, players),
      config
    );

    this.push(lobby);
  }

  add(lobby: Lobby) {
    this.push(lobby);
  }

  close(gameCode: GameCode) {
    let lobbyToBeRemoved;
    const removeIndex = this.findIndex((l) => l.gameCode === gameCode);

    if (removeIndex !== -1) lobbyToBeRemoved = this.splice(removeIndex, 1)[0];
    return lobbyToBeRemoved;
  }

  findByGameCode(gameCode: GameCode) {
    return this.find((l) => l.gameCode === gameCode);
  }
}

export const lobbies = Lobbies.instance;
