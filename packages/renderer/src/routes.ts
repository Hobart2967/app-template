import Home from './views/home/home';

import type { RouteDefinition } from '@solidjs/router';

export const routes: RouteDefinition[] = [
  {
    path: '**',
    component: Home,
  }
];
