import { io } from '../../main';

export const getConnectedRoomClientNicknames: (roomCode: string) => string[] = (
  roomCode: string
) => {
  const connectedClients = [];
  const room = io.sockets.adapter.rooms.get(roomCode);
  console.log(room);

  room &&
    room.forEach((s) =>
      connectedClients.push((io.sockets.sockets.get(s) as any).nickname)
    );

  console.log(connectedClients);

  return connectedClients;
};
