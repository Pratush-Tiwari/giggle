/**
 *
 * Asynchronously loads the component for CreateFolder
 *
 */

import { lazyLoad } from '@/utils/loadable';

export const CreateFolder = lazyLoad(
  () => import('./index'),
  module => module.CreateFolder,
);
