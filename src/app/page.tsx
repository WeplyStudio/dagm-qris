import { Navbar } from '@/components/Navbar';
import { SponsorshipPortal } from '@/components/SponsorshipPortal';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      <Navbar />

      <main className="relative pt-32 pb-20 container mx-auto px-6">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

        <SponsorshipPortal />
      </main>

      <footer className="border-t border-white/10 bg-neutral-950 py-12 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Dewan Aspirasi Generasi Muda. All rights reserved.</p>
      </footer>
    </div>
  );
}