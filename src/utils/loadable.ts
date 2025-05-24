import React, { lazy, Suspense } from 'react';

interface Opts {
  fallback: React.ReactNode;
}
type Unpromisify<T> = T extends Promise<infer P> ? P : never;

export const lazyLoad = <T extends Promise<any>, U extends React.ComponentType<any>>(
  importFunc: () => T,
  selectorFunc?: (s: Unpromisify<T>) => U,
  opts: Opts = { fallback: null },
): React.ComponentType<React.ComponentProps<U>> => {
  let lazyFactory: () => Promise<{ default: U }> = importFunc as any;

  if (selectorFunc) {
    lazyFactory = () => importFunc().then(module => ({ default: selectorFunc(module) }));
  }

  const LazyComponent = lazy(lazyFactory);

  return function LoadableComponent(props: React.ComponentProps<U>): React.ReactElement {
    return React.createElement(
      Suspense,
      { fallback: opts.fallback },
      React.createElement(LazyComponent, props),
    );
  };
};
