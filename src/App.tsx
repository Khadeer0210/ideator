import { useState } from 'react';
import { CinematicIntro } from './components/CinematicIntro';
import { IdeatorCanvas } from './components/IdeatorCanvas';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden">
      {showIntro ? (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      ) : (
        <IdeatorCanvas />
      )}
    </div>
  );
}
