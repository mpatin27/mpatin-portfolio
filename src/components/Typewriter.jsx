import { useState, useEffect } from 'react';

export default function Typewriter({ text, speed = 50, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Petit délai avant de commencer (optionnel)
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, hasStarted, text, speed]);

  return (
    <span>
      {displayedText}
      {/* Curseur qui clignote tant qu'on tape, et s'arrête (ou continue) à la fin */}
      <span className="animate-pulse text-green-500 font-bold">_</span>
    </span>
  );
}