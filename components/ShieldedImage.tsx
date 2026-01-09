
import React from 'react';

interface ShieldedImageProps {
  src: string;
  alt: string;
}

const ShieldedImage: React.FC<ShieldedImageProps> = ({ src, alt }) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-slate-950 aspect-video select-none shadow-2xl">
      {/* 1. Base Image Layer */}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover pointer-events-none brightness-90 grayscale-[0.2]"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />
      
      {/* 2. Dynamic Noise Filter (Simulated protection) */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat animate-pulse" />

      {/* 3. Transparent Interaction Shield */}
      <div className="absolute inset-0 bg-transparent z-20 cursor-default" onContextMenu={(e) => e.preventDefault()} />

      {/* 4. Forensic Watermarking */}
      <div className="absolute inset-0 z-30 pointer-events-none grid grid-cols-4 grid-rows-4 opacity-[0.07]">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="flex items-center justify-center -rotate-12 text-[8px] font-mono text-white tracking-widest uppercase">
            X_SECURE_TWITTERS
          </div>
        ))}
      </div>

      {/* 5. Floating Protection Badge */}
      <div className="absolute bottom-4 left-4 z-40 flex items-center gap-2">
        <div className="bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/20 shadow-lg">
          <i className="fas fa-eye-slash"></i>
          SCREENSHOT BLOCKED
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-indigo-300 flex items-center gap-1.5 border border-indigo-500/30 shadow-lg">
          <i className="fas fa-lock"></i>
          X-ENCRYPTED
        </div>
      </div>
    </div>
  );
};

export default ShieldedImage;