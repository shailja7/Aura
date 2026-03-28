import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Camera, X, Loader2, Play } from 'lucide-react';
import { parseIngredients } from '../utils/parser';

export default function HybridInput({ onAnalyze, onScanStart }) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const webcamRef = useRef(null);
  const debounceTimer = useRef(null);

  // Sync scroll between textarea and mirrored div
  const handleScroll = (e) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.target.scrollTop;
      backdropRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleTextChange = (e) => {
    const newVal = e.target.value;
    setInputText(newVal);

    // Reactive debounced analysis while typing
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const results = parseIngredients(newVal);
      if (onAnalyze) onAnalyze(results);
    }, 600);
  };

  const handleManualSubmit = () => {
    if (!inputText.trim()) return;
    const results = parseIngredients(inputText);
    if (onAnalyze) onAnalyze(results);
  };

  const captureAndAnalyze = async () => {
    if (webcamRef.current) {
      if(onScanStart) onScanStart();
      setIsProcessing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      try {
        const result = await Tesseract.recognize(imageSrc, 'eng');
        const parsedResults = parseIngredients(result.data.text);
        
        // Populate textarea with scanned text
        setInputText(result.data.text);
        
        setIsProcessing(false);
        setShowCamera(false);
        if(onAnalyze) {
          onAnalyze(parsedResults);
        }
      } catch (err) {
        setIsProcessing(false);
        if(onAnalyze) {
          onAnalyze({ error: "Failed to read text. Please try again." });
        }
      }
    }
  };

  // Mirrored Highlight Logic
  // We identify flagged triggers by grabbing the latest results from parseIngredients
  // We do it here reactively based on inputText
  const getHighlightedText = () => {
    if (!inputText.trim()) return null;
    
    // We run a fast silent parse purely for the highlighted names
    const parseData = parseIngredients(inputText);
    const triggers = parseData.flaggedTriggers.map(t => t.name.toLowerCase());
    
    // Safety check if nothing flagged
    if (triggers.length === 0) return inputText;

    // Split text into words and highlight matches
    // Simple naive regex matching for highlighted tokens
    let highlightedHTML = inputText;
    triggers.forEach(trigger => {
       const regex = new RegExp(`(${trigger})`, 'gi');
       highlightedHTML = highlightedHTML.replace(regex, `<mark class="bg-amber-100 text-amber-900 rounded px-1 -mx-1">$1</mark>`);
    });
    
    return <div dangerouslySetInnerHTML={{ __html: highlightedHTML }} />;
  };

  return (
    <div className="relative w-full h-full min-h-[400px] flex flex-col bg-white/70 backdrop-blur-lg rounded-[2.5rem] border border-white/60 shadow-[0_10px_40px_-10px_rgba(46,32,24,0.12)] overflow-hidden transition-all duration-500 font-sans">
      
      {/* 
        ------------- TOP 70%: TEXT WORKSPACE ------------- 
      */}
      <div className="relative flex-1 p-6 z-10 flex flex-col group min-h-[250px]">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#2E2018] opacity-70 mb-4 font-serif">Manual Input</h3>
        
        <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#9EAB9A]/50 transition-all bg-white/40">
           
           {/* Backdrop Mirrored Element */}
           <div 
             ref={backdropRef}
             className="absolute inset-0 p-4 text-[#2E2018] opacity-80 font-sans text-base leading-relaxed whitespace-pre-wrap overflow-hidden pointer-events-none break-words"
             aria-hidden="true"
           >
              {getHighlightedText()}
           </div>

           {/* Transparent Textarea */}
           <textarea
             ref={textareaRef}
             value={inputText}
             onChange={handleTextChange}
             onScroll={handleScroll}
             onBlur={handleManualSubmit}
             placeholder="Paste ingredient list here, separated by commas..."
             className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-[#2E2018] font-sans text-base leading-relaxed resize-none focus:outline-none placeholder:text-[#2E2018]/60"
             spellCheck="false"
           />
        </div>
      </div>

      {/* 
        ------------- DIVIDER ------------- 
      */}
      <div className="relative flex items-center justify-center -translate-y-2 z-10">
        <div className="w-1/3 h-px bg-[#2E2018]/10"></div>
        <span className="bg-[#FFF4E9] text-[#2E2018]/40 text-xs font-bold px-3 py-1 rounded-full absolute backdrop-blur-md shadow-sm border border-white/40">OR</span>
        <div className="w-1/3 h-px bg-[#2E2018]/10"></div>
      </div>

      {/* 
        ------------- BOTTOM 20%: CAMERA BANNER ------------- 
      */}
      <div className="p-6 pt-2 z-10 flex-none bg-[#98a693]/5">
         <button 
           onClick={() => setShowCamera(true)}
           className="w-full relative flex items-center justify-center gap-3 bg-[#9EAB9A] text-white px-6 py-5 rounded-[1.5rem] shadow-[0_6px_0_0_#758471,0_10px_20px_rgba(0,0,0,0.1)] active:shadow-[0_2px_0_0_#758471,0_4px_8px_rgba(0,0,0,0.1)] active:translate-y-1 transition-all duration-150 font-bold tracking-wider uppercase text-sm hover:brightness-105"
         >
           <Camera size={20} />
           Scan Label
         </button>
      </div>

      {/* 
        ------------- FULLSCREEN CAMERA MODAL ------------- 
      */}
      {showCamera && (
        <div className="absolute inset-0 z-50 bg-[#FFF4E9]/95 backdrop-blur-xl flex flex-col border border-white/50 rounded-[2.5rem] p-4 animate-[fade-in_0.3s_ease-out]">
          
          <button onClick={() => setShowCamera(false)} className="absolute top-6 right-6 z-50 bg-white/50 p-2 rounded-full hover:bg-white text-gray-700 transition-colors">
            <X size={20} />
          </button>
          
          <h3 className="text-center font-serif text-xl font-bold text-[#2E2018] mt-4 z-40">Scan Product Label</h3>
          <p className="text-center text-xs text-[#2E2018]/60 mb-6 z-40">Ensure ingredients are fully visible</p>

          <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-inner bg-black/10">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover absolute inset-0 z-0"
            />
            {/* Laser Scanning Animation */}
            {isProcessing && (
              <div className="absolute w-[90%] left-[5%] h-[2px] bg-[#9EAB9A] shadow-[0_0_15px_3px_rgba(158,171,154,0.7)] animate-scan-laser z-10 pointer-events-none rounded-full" />
            )}
            
            <div className="absolute inset-x-0 bottom-0 pb-8 pt-12 bg-gradient-to-t from-black/60 to-transparent z-10 flex flex-col items-center justify-end">
              {isProcessing ? (
                <div className="flex flex-col items-center animate-[bounce_1.5s_infinite]">
                  <Loader2 className="text-white animate-spin mb-2" size={32} />
                  <span className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">Scanning...</span>
                </div>
              ) : (
                <button 
                  onClick={captureAndAnalyze}
                  className="bg-white/30 backdrop-blur-md rounded-full p-4 border-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all text-white flex items-center justify-center focus:outline-none"
                >
                  <div className="bg-white p-4 rounded-full">
                    <Camera className="text-[#9EAB9A]" size={28} />
                  </div>
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
