/**
 *
 * Asynchronously loads the component for CreateNote
 *
 */

import { lazyLoad } from '@/utils/loadable';

export const CreateNote = lazyLoad(
  () => import('./index'),
  module => module.CreateNote,
);