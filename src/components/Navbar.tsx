import React from 'react';

export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl py-4">
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 group cursor-pointer">
        <span className="font-bold text-xl tracking-tight text-white">DAGM.</span>
      </div>
      <div className="text-sm font-medium text-neutral-400">Portal Sponsorship</div>
    </div>
  </nav>
);
