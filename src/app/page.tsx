import { Navbar } from '@/components/Navbar';
import { SponsorshipPortal } from '@/components/SponsorshipPortal';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="relative pt-32 pb-20 container mx-auto px-6">
        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>

        <SponsorshipPortal />
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-2xl rounded-2xl">
              D
            </div>
          </div>
          <p className="text-neutral-500 text-sm font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Dewan Aspirasi Generasi Muda. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-[10px] font-black text-neutral-600 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}