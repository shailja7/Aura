import React from 'react';

const CATEGORIES = ["All", "Cleanser", "Toner", "Serum", "Moisturizer", "SPF", "Makeup"];

export default function CategoryRibbon({ selected, onSelect }) {
  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex items-center gap-3 px-1 w-max">
        {CATEGORIES.map(category => {
          const isActive = selected === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`px-6 py-2 rounded-full font-bold tracking-wide text-sm transition-all duration-300 whitespace-nowrap ${
                isActive 
                  ? "bg-[#9EAB9A] text-[#FFF4E9] shadow-[0_4px_12px_rgba(158,171,154,0.4)]" 
                  : "bg-transparent border border-[#9EAB9A] text-[#2E2018] hover:bg-[#9EAB9A]/10 opacity-70 hover:opacity-100"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
