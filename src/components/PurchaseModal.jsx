import React from 'react';
import { ShoppingBag, X } from 'lucide-react';

export default function PurchaseModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-md bg-[#FFF4E9] rounded-3xl shadow-2xl border border-white p-6 relative animate-[scale-in_0.2s_ease-out]"
        style={{ animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/50 text-gray-500 hover:text-gray-800 p-2 rounded-full transition-colors drop-shadow-sm"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md mb-4 border-4 border-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <p className="text-[#9EAB9A] font-bold tracking-widest uppercase text-xs mb-1">{product.brand}</p>
          <h2 className="text-xl font-black text-gray-800 text-center mb-2 leading-tight">{product.name}</h2>
          <p className="text-sm font-medium text-gray-500 text-center px-4 mb-4">{product.description}</p>
          <span className="text-lg font-bold text-gray-700">{product.price}</span>
        </div>

        {/* 
          // ------------------------------------------------------------------
          // TODO: UPDATE AFFILIATE URL PLACEHOLDERS
          // The a-tag underneath pulls the placeholder (e.g. Amazon/Sephora) 
          // defined in src/data/products.json. When you join the associate 
          // programs, overwrite the json data with your real ref links! 
          // ------------------------------------------------------------------
        */}
        <a 
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full relative flex items-center justify-center gap-3 bg-[#9EAB9A] text-white px-6 py-4 rounded-2xl shadow-[0_6px_0_0_#758471,0_10px_20px_rgba(0,0,0,0.1)] active:shadow-[0_2px_0_0_#758471,0_4px_8px_rgba(0,0,0,0.1)] active:translate-y-1 transition-all duration-150 font-bold tracking-wider uppercase text-sm hover:brightness-105"
        >
          <ShoppingBag size={20} />
          Buy Now
        </a>
      </div>
    </div>
  );
}
