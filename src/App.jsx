import React, { useState } from 'react';
import HybridInput from './components/HybridInput';
import AuraStatus from './components/AuraStatus';
import IngredientChips from './components/IngredientChips';
import SafeSwapGallery from './components/SafeSwapGallery';
import CategoryRibbon from './components/CategoryRibbon';
import WeatherWidget from './components/WeatherWidget';
import LegalFooter from './components/LegalFooter';
import { getSafeSwaps } from './utils/recommender';
import { Camera } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // We pass this handler to HybridInput, which calls it when parse completes.
  const handleAnalyze = (parsedData) => {
    setIsScanning(false);
    if (!parsedData.error) {
      setResults(parsedData);
    } else {
      // Intentionally swallowing parser errors in prod rendering fallback states
    }
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setResults(null); 
  };

  const recommenderData = results && results.flaggedCount > 0 
      ? getSafeSwaps(results, activeCategory) 
      : null;

  return (
    <div className="min-h-screen bg-[#FFF4E9] p-4 md:p-12 relative overflow-hidden font-sans">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#9EAB9A]/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] bg-amber-100/30 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      <main className="max-w-[1200px] mx-auto z-10 relative flex flex-col min-h-full">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between mt-4 gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-800 flex flex-row items-center gap-4 font-serif">
               AURA 
               <span className="bg-[#9EAB9A]/20 text-[#6B7967] text-xs px-2 py-1 flex items-center h-6 rounded-full uppercase tracking-widest font-sans font-bold">Beta</span>
            </h1>
            <p className="text-[#2E2018]/50 mt-2 font-medium tracking-[0.1em] font-sans text-sm uppercase">Know before you glow.</p>
          </div>
          <p className="text-right text-[#2E2018]/40 font-bold tracking-[0.2em] text-xs uppercase font-serif">A Space for Clarity</p>
        </header>

        {/* Category Ribbon */}
        <CategoryRibbon selected={activeCategory} onSelect={setActiveCategory} />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 flex-1 content-start mt-6">
          
          {/* Top Left: 2 Columns, 2 Rows */}
          <div className="md:col-span-2 md:row-span-2 min-h-[400px] flex flex-col">
            <HybridInput onAnalyze={handleAnalyze} onScanStart={handleScanStart} />
          </div>

          {/* Top Right, Top Half: 1 Column Status */}
          <div className="md:col-span-1 md:row-span-1 min-h-[190px] flex flex-col">
             <AuraStatus 
                count={results ? results.flaggedCount : null} 
                isScanning={isScanning} 
              />
          </div>

          {/* Top Right, Bottom Half: 1 Column Weather Widget */}
          <div className="md:col-span-1 md:row-span-1 min-h-[190px] flex flex-col">
             <WeatherWidget />
          </div>

          {/* Bottom Row: 3 Columns */}
          <div className="md:col-span-3 min-h-[150px]">
             <IngredientChips results={results} />
          </div>

          {/* Safe Swap Row (Only if recommended) */}
          {recommenderData && (
             <div className="md:col-span-3 mt-4">
               <SafeSwapGallery recommenderData={recommenderData} />
             </div>
          )}

        </div>
        
        {/* Professional Footer */}
        <LegalFooter />

      </main>
    </div>
  );
}

export default App;
