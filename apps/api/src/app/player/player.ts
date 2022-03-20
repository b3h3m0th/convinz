import { io } from '../../main';

export const getConnectedRoomClientNicknames: (roomCode: string) => string[] = (
  roomCode: string
) => {
  const connectedClients = [];
  io.sockets.adapter.rooms
    .get(roomCode)
    .forEach((s) =>
      connectedClients.push((io.sockets.sockets.get(s) as any).nickname)
    );
  return connectedClients;
};
