import { lazyLoad } from '@/utils/loadable';

export const NoteView = lazyLoad(
  () => import('./index'),
  module => module.NoteView,
);
