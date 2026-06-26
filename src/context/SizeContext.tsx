import React, { createContext, useContext, useState, useEffect } from 'react';

export type SizeMode = 'S' | 'M' | 'L';

interface SizeContextValue {
  sizeMode: SizeMode;
  setSizeMode: (mode: SizeMode) => void;
}

const SizeContext = createContext<SizeContextValue>({
  sizeMode: 'M',
  setSizeMode: () => { },
});

export const useSizeMode = () => useContext(SizeContext);

/**
 * Applies the size mode to the <html> element via data-size attribute.
 * CSS in index.css uses html[data-size="S|M|L"] selectors to:
 *   1. Set html font-size  → scales ALL rem-based Tailwind text/spacing on every page
 *   2. Set CSS custom properties → scales structural elements (header, sidebar, avatars)
 *
 * S = 87.5% (14px base)   M = 100% (16px base)   L = 118.75% (19px base)
 */
function applyMode(mode: SizeMode) {
  document.documentElement.setAttribute('data-size', mode);
}

export const SizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sizeMode, setSizeModeState] = useState<SizeMode>(() => {
    return (localStorage.getItem('buyer_size_mode') as SizeMode) || 'M';
  });

  useEffect(() => {
    applyMode(sizeMode);
  }, [sizeMode]);

  const setSizeMode = (mode: SizeMode) => {
    setSizeModeState(mode);
    localStorage.setItem('buyer_size_mode', mode);
  };

  return (
    <SizeContext.Provider value={{ sizeMode, setSizeMode }}>
      {children}
    </SizeContext.Provider>
  );
};
