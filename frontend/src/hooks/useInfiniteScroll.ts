import { useEffect, useRef } from 'react';

export type UseInfiniteScrollArgs = { callback: () => void; isEnabled: boolean };

export type UseInfiniteScrollContent = ReturnType<typeof useInfiniteScroll>;

export const useInfiniteScroll = ({ callback, isEnabled }: UseInfiniteScrollArgs) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !isEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callback();
      },
      { rootMargin: '200px' },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [callback, isEnabled]);

  return ref;
};
