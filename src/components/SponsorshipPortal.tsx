"use client"

import React, { useState } from 'react';
import { 
  Coffee, 
  Zap, 
  Rocket, 
  Crown, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  ArrowLeft, 
  Check, 
  Copy, 
  Target,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Tier = {
  id: string;
  label: string;
  amount: number;
  icon: React.ElementType;
  desc: string;
};

type QRData = {
  url: string;
  amount: number;
  txId: string;
  tierName: string;
  qrisString: string;
};

const TIERS: Tier[] = [
  { id: 'supporter', label: 'Supporter', amount: 10000, icon: Coffee, desc: 'Traktir kopi tim dev' },
  { id: 'booster', label: 'Booster', amount: 50000, icon: Zap, desc: 'Bantu sewa server' },
  { id: 'mvp', label: 'MVP', amount: 100000, icon: Rocket, desc: 'Support event komunitas' },
  { id: 'legend', label: 'Legend', amount: 500000, icon: Crown, desc: 'Sultan mode on' },
];

const STATIC_QRIS = "00020101021126570011ID.DANA.WWW011893600915399734621102099973462110303UMI51440014ID.CO.QRIS.WWW0215ID10254336895320303UMI5204481453033605802ID5910dhan.store600409146105531766304E6AF";

export const SponsorshipPortal = () => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Result
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(val);

  const getFinalAmount = () => {
    if (selectedTier) return selectedTier.amount;
    if (customAmount) return parseInt(customAmount.replace(/\D/g, '')) || 0;
    return 0;
  };

  const handleGenerate = async () => {
    const amount = getFinalAmount();
    if (amount < 1000) return;

    setStep(2);
    
    try {
      const response = await fetch('https://qris.miraipedia.my.id/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toString(),
          qris: STATIC_QRIS
        }),
      });

      const result = await response.json();

      if (result.status === 'success' && result.data.qris_string) {
        const txId = `DAGM-FUND-${Math.floor(Math.random() * 999999)}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(result.data.qris_string)}&bgcolor=ffffff&color=000000&margin=10`;

        setQrData({
          url: qrUrl,
          amount: amount,
          txId: txId,
          tierName: selectedTier ? selectedTier.label : 'Custom Sponsor',
          qrisString: result.data.qris_string
        });
        setStep(3);
      } else {
        throw new Error(result.message || 'Gagal generate QRIS');
      }
    } catch (error: any) {
      setStep(1);
      toast({
        variant: "destructive",
        title: "Gagal Membuat QRIS",
        description: error.message || "Terjadi kesalahan saat menghubungi server pembayaran.",
      });
    }
  };

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData.txId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // RENDER STEP 3: HALAMAN CHECKOUT BARU
  if (step === 3 && qrData) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up pb-20">
        <div className="space-y-8">
          {/* Header Action & Status */}
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => { setStep(1); setQrData(null); }}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Pemilihan
            </button>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-black text-neutral-500 mb-1">Status</p>
              <div className="px-3 py-1 bg-white text-black text-[10px] font-black rounded-full">WAITING PAYMENT</div>
            </div>
          </div>

          {/* Title Section */}
          <div>
            <h1 className="text-5xl font-bold tracking-tighter">Checkout.</h1>
            <p className="text-neutral-500 font-medium">Selesaikan pembayaran untuk mendukung revolusi.</p>
          </div>

          {/* Teks Pemilihan / Info Nominal (Berada DI ATAS QR Card) */}
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-neutral-500 mb-2">Total Dukungan</p>
              <h2 className="text-5xl font-black text-white">{formatRupiah(qrData.amount)}</h2>
              <span className="inline-block mt-3 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                Tier: {qrData.tierName}
              </span>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500 font-medium">Transaction ID</span>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-white font-mono font-bold hover:text-neutral-400 transition-colors"
              >
                {qrData.txId}
                {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
              </button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500 font-medium">Admin Fee</span>
              <span className="text-green-500 font-bold italic">Rp 0 (Free)</span>
            </div>
          </div>

          {/* QR Card (Sekarang berada DI BAWAH teks pemilihan) */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center space-y-8">
            <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-white/5">
              <img 
                src={qrData.url} 
                alt="QRIS Payment" 
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="text-center space-y-3">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Metode Pembayaran</p>
              <div className="flex flex-col items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" className="h-4 invert opacity-70" alt="QRIS" />
                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest leading-relaxed">GOPAY / OVO / DANA / MOBILE BANKING</span>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Info size={20} className="text-neutral-400" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pastikan nominal yang tertera pada aplikasi pembayaran Anda sesuai dengan total di atas. Dana akan langsung masuk ke rekening aspirasi DAGM secara transparan.
            </p>
          </div>

          {/* Footer Footer */}
          <div className="text-center pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-600">
              Powered by DAGM Finance &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // RENDER STEP 1 & 2: PEMILIHAN
  return (
    <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-start">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-300">Open Sponsorship</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
          FUEL THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
            REVOLUTION.
          </span>
        </h1>
        
        <p className="text-lg text-neutral-400 leading-relaxed max-w-md">
          Dukungan Anda memungkinkan <span className="text-white">DAGM</span> terus membangun ekosistem kolaboratif untuk pemuda Indonesia. Transparan, langsung, dan berdampak.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 text-center">
            <div className="text-3xl font-black mb-1 text-white">100%</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Dana Tersalurkan</div>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 text-center">
            <div className="text-3xl font-black mb-1 text-white">Zero</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Platform Fee</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INPUT SECTION */}
      <div className="lg:col-span-7">
        <div className="glass-card rounded-3xl p-1 md:p-2 shadow-2xl shadow-black/50 overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-500 hover:shadow-white/5">
          
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target size={200} className="text-white" />
          </div>

          <div className="bg-black/40 rounded-[1.3rem] flex-1 p-6 md:p-10 border border-white/5 relative z-10 flex flex-col">
            
            {/* STEP 1: INPUT */}
            {step === 1 && (
              <div className="animate-fade-up space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Pilih Dukungan</h2>
                  <p className="text-neutral-400 text-sm">Pilih tier sponsorship atau masukkan nominal bebas.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => { setSelectedTier(tier); setCustomAmount(''); }}
                      className={cn(
                        "group relative p-5 rounded-2xl border text-left transition-all duration-300",
                        selectedTier?.id === tier.id 
                          ? 'bg-white text-black border-white ring-4 ring-white/20' 
                          : 'bg-neutral-900/50 border-white/10 text-neutral-400 hover:bg-neutral-800 hover:border-white/30 hover:text-white'
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <tier.icon size={24} />
                        {selectedTier?.id === tier.id && <CheckCircle size={20} className="text-black" />}
                      </div>
                      <div className="font-bold text-lg">{tier.label}</div>
                      <div className={cn(
                        "text-sm mt-1",
                        selectedTier?.id === tier.id ? 'text-neutral-600' : 'text-neutral-500'
                      )}>
                        {formatRupiah(tier.amount)}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-neutral-500 font-bold">Rp</span>
                  </div>
                  <input 
                    type="number" 
                    placeholder="Atau masukkan nominal lain..."
                    value={customAmount}
                    onChange={(e) => { 
                      setCustomAmount(e.target.value); 
                      setSelectedTier(null); 
                    }}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold placeholder-neutral-600 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={getFinalAmount() < 1000}
                    onClick={handleGenerate}
                    className="w-full group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Lanjut ke Pembayaran <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </span>
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500 uppercase tracking-widest font-semibold">
                    <Shield size={12} /> Secure QRIS Gateway
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LOADING */}
            {step === 2 && (
              <div className="flex-1 flex flex-col items-center justify-center animate-fade-up text-center">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-b-2 border-l-2 border-neutral-600 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                  <Zap className="absolute inset-0 m-auto text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-white">Generating QRIS</h3>
                <p className="text-neutral-400">Menghubungkan ke secure payment gateway...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};