import {
  GameCode,
  Lobby,
  Player,
  Players,
  Round,
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

  create(gameCode: string, roundsAmount: RoundsAmount, players: Player[]) {
    const lobby = new Lobby(
      gameCode,
      roundsAmount,
      [],
      new Players(gameCode, players)
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

  getTotalReceivedVotesOfPlayer(gameCode: GameCode, playerId: string) {
    const lobby = this.findByGameCode(gameCode);

    return lobby.roundHistory.reduce((acc, curr) => {
      return curr.getTotalReceivedVotesOfPlayer(playerId) + acc;
    }, 0);
  }
}

export const lobbies = Lobbies.instance;
