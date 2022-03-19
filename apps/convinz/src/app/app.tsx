import React from 'react';
import { Provider as StoreProvider } from 'mobx-react';
import * as fromRouter from '@convinz/router';
import { gameStore } from '@convinz/stores';

const stores = { gameStore };

export const App: React.FC = () => {
  return (
    <React.StrictMode>
      <StoreProvider {...stores}>
        <fromRouter.Router />
      </StoreProvider>
    </React.StrictMode>
  );
};

export default App;
