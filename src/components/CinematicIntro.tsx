import { useRef, useState, useEffect } from 'react';

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleProceed = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    
    // Smoothly fade out the container
    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
    }
    
    // Wait for the CSS transition to finish before unmounting
    setTimeout(() => {
      onComplete();
    }, 1500); 
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 bg-[#000] z-[9999] flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-opacity duration-[1500ms] ease-in-out"
      onClick={handleProceed}
    >
      {/* 
        Place your generated video file in the /public folder and name it 'intro.mp4'.
        It will automatically load and play here. 
      */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover opacity-90 transition-opacity duration-1000"
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleProceed}
        onError={(e) => {
          // Fallback if video is not found yet - just proceed to app after a short delay
          setTimeout(handleProceed, 2000);
        }}
      />
      
      {/* Overlay to hint at skipping */}
      <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none">
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase animate-pulse">
          Click anywhere to skip
        </p>
      </div>
    </div>
  );
}
