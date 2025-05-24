/**
 *
 * Asynchronously loads the component for Some
 *
 */

import { lazyLoad } from '@/utils/loadable';

export const Signup = lazyLoad(
  () => import('./index'),
  module => module.Signup,
);
