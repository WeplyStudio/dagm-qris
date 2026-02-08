import React from 'react';

export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl py-4">
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl rounded-lg group-hover:rotate-12 transition-transform duration-300">
          D
        </div>
        <span className="font-bold text-xl tracking-tight text-white">DAGM.</span>
      </div>
      <div className="text-sm font-medium text-neutral-400">Portal Sponsorship</div>
    </div>
  </nav>
);