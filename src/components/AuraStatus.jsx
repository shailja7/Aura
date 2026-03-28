import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AuraStatus({ count, isScanning }) {
  // Determine status color based on trigger count
  const isSafe = count === 0;
  const statusColor = isSafe ? 'text-[#9EAB9A]' : 'text-amber-500';
  const glowColor = isSafe ? 'shadow-[0_0_30px_rgba(158,171,154,0.4)]' : 'shadow-[0_0_30px_rgba(245,158,11,0.4)]';
  const ringColor = isSafe ? 'ring-[#9EAB9A]/40 border-[#9EAB9A]' : 'ring-amber-500/40 border-amber-400';
  const Icon = isSafe ? ShieldCheck : AlertTriangle;

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-[0_10px_40px_-10px_rgba(46,32,24,0.08)] transition-all duration-300 ease-in-out p-6 relative">
      <h2 className="absolute top-6 left-6 text-sm font-bold tracking-wider text-[#2E2018] uppercase opacity-70 font-sans">Triggers</h2>
      
      {isScanning ? (
        <div className="w-40 h-40 rounded-full border-4 border-dashed border-gray-300 animate-[spin_4s_linear_infinite] flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      ) : count !== null ? (
        <div className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center bg-white/80 border-2 transition-all duration-500 ${ringColor} ${glowColor} ring-4 ring-offset-4 ring-offset-transparent backdrop-blur`}>
          <Icon className={`absolute -top-4 -right-2 w-10 h-10 bg-white rounded-full p-2 shadow-sm border ${isSafe ? 'text-[#9EAB9A] border-[#9EAB9A]/20' : 'text-amber-500 border-amber-400/20'}`} />
          <span className={`text-[5rem] leading-none mb-2 font-black tracking-tighter ${statusColor} font-serif drop-shadow-sm`}>{count}</span>
          <span className="text-[#2E2018]/40 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Found</span>
        </div>
      ) : (
        <div className="w-48 h-48 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
           <span className="text-sm font-medium tracking-wide">Waiting...</span>
        </div>
      )}
      
      {/* Decorative caption */}
      {count !== null && !isScanning && (
        <p className={`mt-8 text-sm font-bold tracking-wide ${isSafe ? 'text-[#9EAB9A]' : 'text-amber-600'}`}>
          {isSafe ? '100% FA Safe' : 'Triggers Detected'}
        </p>
      )}
    </div>
  );
}
