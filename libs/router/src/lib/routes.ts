/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { propnameOf } from '@convinz/shared/util';
import { lazy } from 'react';

export const pages = {
  home: {
    component: lazy(() =>
      import('@convinz/pages').then((module) => ({ default: module.Home }))
    ),
  },
  game: {
    component: lazy(() =>
      import('@convinz/pages').then((module) => ({ default: module.Game }))
    ),
  },
  error: {
    component: lazy(() =>
      import('@convinz/pages').then((module) => ({ default: module.Error }))
    ),
  },
} as const;

/**
 * @key Route name
 * @value URL route
 */
export type ROUTES = {
  [K in keyof typeof pages]: K extends 'home'
    ? `/`
    : K extends 'game'
    ? `play`
    : K extends 'error'
    ? `*`
    : `${K}`;
};
export const ROUTES: ROUTES = Object.keys(pages).reduce(
  (acc, curr) =>
    curr === propnameOf<typeof pages>(pages, (p) => p.home)
      ? { ...acc, [curr]: `/` }
      : curr === propnameOf<typeof pages>(pages, (p) => p.game)
      ? { ...acc, [curr]: `play` }
      : curr === propnameOf<typeof pages>(pages, (p) => p.error)
      ? { ...acc, [curr]: `*` }
      : { ...acc, [curr]: `${curr}` },
  {}
) as ROUTES;

console.log(JSON.stringify(ROUTES));
