import './router.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { Home, Error } from '@convinz/pages';

/* eslint-disable-next-line */
export interface RouterProps {}

export const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return (
    <BrowserRouter>
      <Suspense fallback={() => <div>Loading</div>}></Suspense>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'*'} element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
