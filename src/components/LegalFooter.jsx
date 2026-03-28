import React from 'react';

export default function LegalFooter() {
  return (
    <footer className="mt-20 pb-12 px-6 text-center max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start text-[#2E2018] opacity-60 text-xs font-medium leading-relaxed tracking-wide">
        
        <div className="flex-1 text-center md:text-left">
          <strong className="block mb-2 font-bold uppercase tracking-widest text-[10px] opacity-80">Privacy Policy</strong>
          <p>AURA processes all photos and ingredient scans locally on your device using Edge AI (Tesseract.js). Your data is never uploaded to a server.</p>
        </div>

        <div className="w-px h-12 bg-[#2E2018] opacity-20 hidden md:block mt-2"></div>

        <div className="flex-1 text-center md:text-left">
          <strong className="block mb-2 font-bold uppercase tracking-widest text-[10px] opacity-80">Medical Disclaimer</strong>
          <p>AURA is an informational tool and does not provide medical advice. Always consult a dermatologist before starting a new regimen.</p>
        </div>

      </div>
      
      <p className="mt-12 text-[#2E2018] opacity-40 text-[10px] uppercase font-bold tracking-[0.3em]">
        &copy; {new Date().getFullYear()} AURA Auditor
      </p>
    </footer>
  );
}
