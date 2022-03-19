import React, { useEffect, useState } from 'react';
import { Provider as StoreProvider } from 'mobx-react';
import * as fromRouter from '@convinz/router';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3333', {
  transports: ['websocket'],
});

const stores = {};

export const App: React.FC = () => {
  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data);
    });
  });

  return (
    <React.StrictMode>
      <StoreProvider {...stores}>
        <fromRouter.Router />
      </StoreProvider>
    </React.StrictMode>
  );
};

export default App;
