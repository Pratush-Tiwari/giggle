/**
 *
 * Main
 *
 */
import { memo } from 'react';

interface Props {}

export const Main = memo((props: Props) => {
  console.log(props);
  return <div>Main component</div>;
});
