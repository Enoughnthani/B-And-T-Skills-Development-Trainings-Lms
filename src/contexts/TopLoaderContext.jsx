import { createContext, useContext, useRef, useState } from "react";

const TopLoaderContext = createContext();

export const TopLoaderProvider = ({ children }) => {
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const start = () => {
    if(visible){
      return;
    }
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setProgress(0);
    setVisible(true);

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      // Ease to ~90%
      const next = Math.min(
        90,
        100 * (1 - Math.exp(-elapsed / 1800))
      );

      setProgress(next);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const complete = () => {
    cancelAnimationFrame(rafRef.current);
    setProgress(100);

    // small delay for visual completion
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  };

  return (
    <TopLoaderContext.Provider value={{ start, complete,visible }}>
      {visible && (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[9999]">
          <div
            className="h-[4px] bg-red-500 origin-left transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      )}
      {children}
    </TopLoaderContext.Provider>
  );
};

export const useTopLoader = () => useContext(TopLoaderContext);
