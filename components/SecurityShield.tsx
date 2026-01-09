
import React, { useEffect, useState, ReactNode } from 'react';

interface SecurityShieldProps {
  children: ReactNode;
}

const SecurityShield: React.FC<SecurityShieldProps> = ({ children }) => {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Common screenshot shortcuts
      if (
        e.key === 'PrintScreen' || 
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.key === 'p')
      ) {
        setIsBlurred(true);
        alert("Screenshots and printing are disabled for privacy protection.");
        setTimeout(() => setIsBlurred(false), 2000);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('blur', () => setIsBlurred(true));
    window.addEventListener('focus', () => setIsBlurred(false));

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('blur', () => setIsBlurred(true));
      window.removeEventListener('focus', () => setIsBlurred(false));
    };
  }, []);

  return (
    <div className={`screenshot-shield min-h-screen ${isBlurred ? 'window-blurred' : ''}`}>
      {children}
      {isBlurred && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-8">
          <div className="text-center">
            <i className="fas fa-eye-slash text-6xl text-rose-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-white">Privacy Protected</h2>
            <p className="text-slate-400 mt-2">Content is hidden while you are away or attempting a screen capture.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityShield;
