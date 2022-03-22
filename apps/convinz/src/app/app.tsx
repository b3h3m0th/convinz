import React from 'react';
import './app.scss';
import { Provider as StoreProvider } from 'mobx-react';
import * as fromRouter from '@convinz/router';
import { gameStore } from '@convinz/stores';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

const stores = { gameStore };

export const App: React.FC = () => {
  return (
    <React.StrictMode>
      <StoreProvider {...stores}>
        <MantineProvider
          theme={{
            spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
          }}
          withNormalizeCSS
          withGlobalStyles
        >
          <div className="app">
            <NotificationsProvider>
              <fromRouter.Router />
            </NotificationsProvider>
          </div>
        </MantineProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};

export default App;
