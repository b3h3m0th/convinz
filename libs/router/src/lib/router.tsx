import './router.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { pages, ROUTES } from './routes';
import { propnameOf } from '@convinz/shared/util';

/* eslint-disable-next-line */
export interface RouterProps {}

export const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
          {Object.entries(pages).map(([pageKey, component]) => (
            <Route
              key={pageKey}
              path={`/${ROUTES[pageKey as keyof typeof pages]}${
                pageKey === propnameOf<typeof ROUTES>(ROUTES, (r) => r.game)
                  ? `/*`
                  : ``
              }`}
              element={<component.component />}
            />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
export * from './routes';
