import './router.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { pages, ROUTES } from './routes';
import { Loader } from '@mantine/core';

/* eslint-disable-next-line */
export interface RouterProps {}

export const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              height: '100vh',
              width: '100vw',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route
            path={`${ROUTES.home}`}
            element={<pages.home.component />}
          ></Route>
          <Route
            path={`${ROUTES.game}/:gameCode`}
            element={<pages.game.component />}
          ></Route>
          <Route
            path={`${ROUTES.error}`}
            element={<pages.error.component />}
          ></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
export * from './routes';
