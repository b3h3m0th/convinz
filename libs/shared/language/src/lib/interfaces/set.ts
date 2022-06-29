export interface ISet {
  home: {
    subheading: string;
    gameCode: string;
    nickname: string;
    joinGame: string;
    createGame: string;
  };
  lobby: {
    connectedPlayers: string;
    leaveLobby: string;
    startGame: string;
  };
  game: {
    submitExplanation: string;
  };
  settings: {
    title: string;
    language: string;
    save: string;
  };
}
