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
    gameCodeCopied: string;
    leaveLobby: string;
    startGame: string;
  };
  game: {
    submitExplanation: string;
    instructions: string;
  };
  settings: {
    title: string;
    language: string;
    save: string;
  };
}
