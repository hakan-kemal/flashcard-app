import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/study-mode.tsx'),
  route('all-cards', 'routes/all-cards.tsx'),
] satisfies RouteConfig;
