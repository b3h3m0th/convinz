import { useEffect } from 'react';

export const useBeforeUnload = (effect: () => void = () => void 0) => {
  useEffect(() => {
    const cleanup = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      effect();
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);
};
