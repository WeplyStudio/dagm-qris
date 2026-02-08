import React from 'react';

export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl py-4">
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl rounded-xl group-hover:rotate-6 transition-transform duration-300">
          D
        </div>
        <span className="font-bold text-xl tracking-tight text-white">DAGM.</span>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <div className="text-xs font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-400">
          PORTAL SPONSORSHIP v1.0
        </div>
      </div>
    </div>
  </nav>
);