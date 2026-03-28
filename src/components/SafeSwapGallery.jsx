import React, { useState } from 'react';
import PurchaseModal from './PurchaseModal';
import { Sparkles } from 'lucide-react';

export default function SafeSwapGallery({ recommenderData }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!recommenderData || !recommenderData.recommendations || recommenderData.recommendations.length === 0) {
    return null;
  }

  const { category, recommendations } = recommenderData;

  return (
    <div className="w-full mt-8 fade-in flex flex-col pt-6 border-t border-[#9EAB9A]/20">
      
      <div className="mb-6 flex items-center justify-between">
         <div>
           <h3 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
             <Sparkles className="text-amber-500" size={24} />
             Safe Swaps
           </h3>
           <p className="text-sm font-medium text-gray-500 mt-1">Recommended 100% safe {category.toLowerCase()}s</p>
         </div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="flex overflow-x-auto pb-8 pt-2 -mx-4 px-4 gap-6 custom-scrollbar snap-x snap-mandatory">
        {recommendations.map((product) => (
          <div 
            key={product.id} 
            className="flex-none w-[260px] snap-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col relative overflow-hidden group"
          >
            {/* Soft Focus Image */}
            <div className="h-[200px] w-full relative overflow-hidden bg-[#FFF4E9]">
              {/* Fake soft focus background */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110" 
                style={{ backgroundImage: `url(${product.image})` }} 
              />
              <img 
                src={product.image} 
                alt={product.brand} 
                className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
               <div>
                  <p className="text-[#9EAB9A] font-bold text-xs tracking-widest uppercase mb-1">{product.brand}</p>
                  <h4 className="text-gray-800 font-bold leading-snug text-lg mb-2">{product.name}</h4>
               </div>
               
               <div className="mt-4 flex flex-col gap-3 pb-1">
                 <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full relative bg-[#9EAB9A] text-white px-4 py-3 rounded-2xl shadow-[0_4px_0_0_#758471,0_10px_10px_rgba(0,0,0,0.05)] active:shadow-[0_1px_0_0_#758471,0_2px_4px_rgba(0,0,0,0.05)] active:translate-y-1 transition-all duration-150 font-bold tracking-wide text-sm"
                 >
                    View on Shelf
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Portal */}
      {selectedProduct && (
         <PurchaseModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
         />
      )}
    </div>
  );
}
