import { useEffect } from 'react';

export const useBeforeUnload = (effect: () => void = () => void 0) => {
  const cleanup = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave the lobby?';
    effect();
  };

  useEffect(() => {
    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);
};
