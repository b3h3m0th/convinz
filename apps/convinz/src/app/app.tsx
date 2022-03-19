import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3333', {
  transports: ['websocket'],
});

export const App = () => {
  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data);
    });
  });

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to convinz!</h1>
        <img
          width="450"
          src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png"
          alt="Nx - Smart, Fast and Extensible Build System"
        />
      </div>
      <div>Convinz</div>
      <button
        onClick={() => {
          socket.emit('message', { test: 'hi' });
        }}
      >
        Emit
      </button>
    </>
  );
};

export default App;
