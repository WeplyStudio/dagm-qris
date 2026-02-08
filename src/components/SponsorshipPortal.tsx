"use client"

import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
};

const TIERS: Tier[] = [
  { id: 'supporter', label: 'Supporter', amount: 10000, icon: Coffee, desc: 'Traktir kopi tim dev' },
  { id: 'booster', label: 'Booster', amount: 50000, icon: Zap, desc: 'Bantu sewa server' },
  { id: 'mvp', label: 'MVP', amount: 100000, icon: Rocket, desc: 'Support event komunitas' },
  { id: 'legend', label: 'Legend', amount: 500000, icon: Crown, desc: 'Sultan mode on' },
];

export const SponsorshipPortal = () => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Result
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [copied, setCopied] = useState(false);

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(val);

  const getFinalAmount = () => {
    if (selectedTier) return selectedTier.amount;
    const parsed = parseInt(customAmount.replace(/\D/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleGenerate = () => {
    const amount = getFinalAmount();
    if (amount < 1000) return;

    setStep(2);
    
    // Simulate Payment Gateway API
    setTimeout(() => {
      const txId = `DAGM-FUND-${Math.floor(100000 + Math.random() * 899999)}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=DAGM-${amount}-${txId}&bgcolor=ffffff&color=000000&margin=10`;
      
      setQrData({
        url: qrUrl,
        amount: amount,
        txId: txId,
        tierName: selectedTier ? selectedTier.label : 'Custom Sponsor'
      });
      setStep(3);
    }, 2500);
  };

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData.txId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-start">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-300">Open Sponsorship</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
          FUEL THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-accent to-neutral-600">
            REVOLUTION.
          </span>
        </h1>
        
        <p className="text-lg text-neutral-400 leading-relaxed max-w-md font-medium">
          Dukungan Anda memungkinkan <span className="text-white">DAGM</span> terus membangun ekosistem kolaboratif untuk pemuda Indonesia. Transparan, langsung, dan berdampak.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md">
            <div className="text-3xl font-black mb-1 text-white">100%</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Dana Tersalurkan</div>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md">
            <div className="text-3xl font-black mb-1 text-white">Zero</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Platform Fee</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-7">
        <div className="glass-card rounded-3xl p-1 md:p-1.5 shadow-2xl shadow-black/80 overflow-hidden min-h-[640px] flex flex-col relative transition-all duration-700 hover:shadow-primary/5">
          
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target className="w-[240px] h-[240px] text-white" />
          </div>

          <div className="bg-black/50 rounded-[1.6rem] flex-1 p-6 md:p-10 border border-white/5 relative z-10 flex flex-col">
            
            {/* STEP 1: INPUT */}
            {step === 1 && (
              <div className="animate-fade-up space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Pilih Dukungan</h2>
                  <p className="text-neutral-400 text-sm font-medium">Pilih tier sponsorship atau masukkan nominal bebas.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => { setSelectedTier(tier); setCustomAmount(''); }}
                      className={cn(
                        "group relative p-5 rounded-2xl border text-left transition-all duration-300",
                        selectedTier?.id === tier.id 
                          ? 'bg-white text-black border-white ring-8 ring-white/5' 
                          : 'bg-neutral-900/50 border-white/10 text-neutral-400 hover:bg-neutral-800 hover:border-white/30 hover:text-white'
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <tier.icon className={cn("w-6 h-6", selectedTier?.id === tier.id ? "text-black" : "text-neutral-400 group-hover:text-primary transition-colors")} />
                        {selectedTier?.id === tier.id && <CheckCircle className="w-5 h-5 text-black" />}
                      </div>
                      <div className="font-bold text-lg">{tier.label}</div>
                      <div className={cn(
                        "text-sm mt-1 font-semibold",
                        selectedTier?.id === tier.id ? 'text-neutral-600' : 'text-neutral-500'
                      )}>
                        {formatRupiah(tier.amount)}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-neutral-500 font-bold">Rp</span>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="Atau masukkan nominal lain..."
                      value={customAmount}
                      onChange={(e) => { 
                        setCustomAmount(e.target.value); 
                        setSelectedTier(null); 
                      }}
                      className="h-16 bg-neutral-900/50 border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold text-lg placeholder-neutral-700 focus:border-primary/50 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      disabled={getFinalAmount() < 1000}
                      onClick={handleGenerate}
                      className="w-full h-16 group bg-white text-black text-lg font-black rounded-2xl hover:bg-neutral-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
                    >
                      LANJUT KE PEMBAYARAN 
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                    </Button>
                    <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-neutral-500 uppercase tracking-widest font-black">
                      <Shield className="w-3 h-3" /> Secure QRIS Payment Gateway
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LOADING */}
            {step === 2 && (
              <div className="flex-1 flex flex-col items-center justify-center animate-fade-up text-center">
                <div className="relative w-32 h-32 mb-10">
                  <div className="absolute inset-0 border-t-4 border-r-4 border-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-b-4 border-l-4 border-accent rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                  <RefreshCw className="absolute inset-0 m-auto text-white animate-pulse" size={40} />
                </div>
                <h3 className="text-4xl font-black mb-3 text-white">GENERATING</h3>
                <p className="text-neutral-400 font-medium max-w-xs mx-auto">Menghubungkan ke secure payment gateway FINANCE DAGM...</p>
              </div>
            )}

            {/* STEP 3: SUCCESS / QR DISPLAY */}
            {step === 3 && qrData && (
              <div className="flex-1 flex flex-col animate-fade-up">
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => { setStep(1); setQrData(null); }}
                    className="flex items-center gap-2 text-sm font-black text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                  </button>
                  <div className="px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black border border-primary/20 text-primary uppercase tracking-widest">
                    PAYMENT REQUEST
                  </div>
                </div>

                <div className="bg-white text-black rounded-3xl p-2 relative overflow-hidden flex-1 flex flex-col">
                  <div className="bg-neutral-50 rounded-2xl p-6 text-center border-b border-neutral-200">
                    <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Sponsorship Amount</p>
                    <h2 className="text-5xl font-black tracking-tighter text-black">{formatRupiah(qrData.amount)}</h2>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold bg-white px-4 py-1.5 rounded-full border border-neutral-200 shadow-sm text-neutral-700">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {qrData.tierName}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute top-0 left-6 right-6 h-px" style={{ backgroundImage: 'linear-gradient(to right, #ccc 50%, transparent 50%)', backgroundSize: '12px 1px', backgroundRepeat: 'repeat-x' }}></div>
                    
                    <div className="bg-white p-3 rounded-2xl border-2 border-neutral-100 shadow-2xl mb-8 mt-4">
                      <img src={qrData.url} alt="QRIS Code" className="w-52 h-52 object-contain" />
                    </div>
                    
                    <p className="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-loose max-w-[240px] mb-8">
                      SCAN USING GOPAY, OVO, DANA, LINKAJA, OR MOBILE BANKING
                    </p>

                    <div 
                      className="w-full bg-neutral-50 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-neutral-100 transition-colors border border-neutral-100" 
                      onClick={copyToClipboard}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] uppercase font-black text-neutral-400 tracking-widest">Transaction ID</span>
                        <span className="font-mono font-bold text-sm text-black">{qrData.txId}</span>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-neutral-200 group-hover:border-primary transition-colors">
                        {copied ? <Check className="w-5 h-5 text-green-600"/> : <Copy className="w-5 h-5 text-neutral-400" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-900 text-white p-4 text-center rounded-b-2xl rounded-t-lg mx-1.5 mb-1.5">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-neutral-500">Finance.DAGM / 2024</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};