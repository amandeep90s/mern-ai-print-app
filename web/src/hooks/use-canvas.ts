import { useContext } from 'react';

import { CanvasContext } from '@/context/canvas-context';

export function useCanvas() {
  const ctx = useContext(CanvasContext);

  if (!ctx) throw new Error('useCanvas must be used inside <CanvasProvider>');

  return ctx;
}
