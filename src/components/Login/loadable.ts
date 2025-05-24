/**
 *
 * Asynchronously loads the component for Some
 *
 */

import { lazyLoad } from '@/utils/loadable';

export const Login = lazyLoad(
  () => import('./index'),
  module => module.Login,
);
