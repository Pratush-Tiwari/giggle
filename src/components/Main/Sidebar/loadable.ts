/**
 *
 * Asynchronously loads the component for Sidebar
 *
 */

import { lazyLoad } from '@/utils/loadable';

export const Sidebar = lazyLoad(
  () => import('./index'),
  module => module.Sidebar,
);
