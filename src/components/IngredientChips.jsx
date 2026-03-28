import React from 'react';
import { Check, X as XIcon, HelpCircle } from 'lucide-react';

export default function IngredientChips({ results }) {
  if (!results) {
    return (
      <div className="w-full h-full min-h-[150px] flex items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 p-6 text-gray-400 font-medium">
        Scan an ingredient list to see details.
      </div>
    );
  }

  const { matchedCount = 0, flaggedCount = 0, unknownCount = 0, matched = [], flaggedTriggers = [], unknownIngredients = [] } = results;

  // Derive the safe matches
  const flaggedNames = new Set(flaggedTriggers.map(t => t.name));
  const safeIngredients = matched?.filter(m => !flaggedNames.has(m.name)) || [];

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-[0_10px_40px_-10px_rgba(46,32,24,0.08)] p-6 md:p-8 flex flex-col items-start transition-all overflow-hidden h-full">
      <h3 className="text-xl font-bold text-[#2E2018] font-sans tracking-tight flex items-center gap-2 mb-6">
        Scanned Results
        <span className="text-sm font-normal text-gray-400 bg-white/50 px-3 py-1 rounded-full">
          {matchedCount + unknownCount} found
        </span>
      </h3>

      <div className="flex flex-col gap-6">
        {/* SAFE */}
        {safeIngredients.length > 0 && (
          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-[#9EAB9A] mb-3 ml-1">Safe ({safeIngredients.length})</h4>
             <div className="flex flex-wrap gap-2">
               {safeIngredients.map((ing, idx) => (
                 <span key={`safe-${idx}`} className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-[#9EAB9A]/10 to-[#9EAB9A]/5 border border-[#9EAB9A]/30 text-[#6B7967] rounded-full text-sm font-medium transition-all hover:bg-[#9EAB9A]/20 cursor-default shadow-sm">
                   <Check size={14} className="opacity-70" />
                   {ing.name}
                 </span>
               ))}
             </div>
          </div>
        )}

        {/* FLAGGED */}
        {flaggedTriggers.length > 0 && (
          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 ml-1">Triggers ({flaggedCount})</h4>
             <div className="flex flex-wrap gap-2">
               {flaggedTriggers.map((ing, idx) => (
                 <div key={`flag-${idx}`} className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 text-amber-700 rounded-full text-sm font-medium transition-all hover:bg-amber-500/20 cursor-help shadow-sm">
                   <XIcon size={14} className="opacity-70" />
                   {ing.name}
                   
                   {/* Tooltip on hover */}
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white shadow-xl border border-amber-100 rounded-xl text-xs text-gray-600 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10">
                      <p className="font-bold text-amber-700 mb-1">{ing.name}</p>
                      <p>{ing.explanation}</p>
                      {ing.safe_swap && (
                        <p className="mt-2 text-[#9EAB9A] font-medium"><strong className="text-gray-400">Swap:</strong> {ing.safe_swap}</p>
                      )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* UNKNOWN */}
        {unknownIngredients.length > 0 && (
          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Unknown ({unknownCount})</h4>
             <div className="flex flex-wrap gap-2">
               {unknownIngredients.map((ing, idx) => (
                 <span key={`unk-${idx}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100/50 border border-gray-200 text-gray-500 rounded-full text-sm transition-all hover:bg-gray-100 cursor-default shadow-sm">
                   <HelpCircle size={14} className="opacity-50" />
                   {ing}
                 </span>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
