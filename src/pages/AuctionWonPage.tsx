import React, { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

interface AuctionWonPageProps {
  lotNumber?: string;
  onBackToAuctions: () => void;
  onBookTransport: () => void;
}

export const AuctionWonPage: React.FC<AuctionWonPageProps> = ({
  lotNumber = '#A-2295',
  onBackToAuctions,
  onBookTransport
}) => {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      size: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2; // slight upward drift
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.size = Math.random() * 4 + 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // gravity
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    let particles: Particle[] = [];

    // Trigger explosions from different positions
    const createExplosion = (x: number, y: number) => {
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y));
      }
    };

    // Initial blast
    createExplosion(width / 2, height / 2 - 100);
    createExplosion(width / 3, height / 2 - 50);
    createExplosion((width * 2) / 3, height / 2 - 50);

    // Continuous random bursts
    const interval = setInterval(() => {
      createExplosion(Math.random() * width, Math.random() * (height / 2));
    }, 1500);

    // Resize listener
    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex justify-center items-center py-6 relative">
      {/* Confetti Firecracker Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-50 w-full h-full"
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md max-w-2xl w-full relative z-10">
        {/* Congratulations Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-10 px-6 space-y-3">
          <div className="text-4xl animate-bounce">🏆</div>
          <h2 className="text-2xl font-black tracking-tight">Congratulations!</h2>
          <p className="text-sm text-emerald-100">You've won the auction</p>
        </div>

        {/* Content Box */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Lot Summary Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#1b4d4f]">Lot {lotNumber} &mdash; Paddy Grade A</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Winning Bid</span>
                <span className="text-emerald-600">₹19,500/quintal</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Quantity</span>
                <span>5 MT (50 qtl)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Agent</span>
                <span>Murugan Kandasamy</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Market</span>
                <span>Thoothukudi APMC</span>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800">Invoice Summary</h4>
            <div className="divide-y divide-slate-100 font-medium text-slate-600">
              <div className="flex justify-between py-2">
                <span>Produce Value (50 qtl &times; ₹19,500)</span>
                <span>₹9,75,000</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Mandi Commission (1.5%)</span>
                <span>₹14,625</span>
              </div>
              <div className="flex justify-between py-2">
                <span>GST (5%)</span>
                <span>₹48,750</span>
              </div>
              <div className="flex justify-between py-2.5 font-bold text-slate-800 text-sm">
                <span>Total Payable</span>
                <span>₹10,38,375</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg text-xs text-emerald-800 leading-normal">
            Payment deducted from your wallet. Invoice available in Documents.
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => showToast('Generating invoice PDF...', 'info')}
              className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-3 rounded-md transition shadow-xs flex items-center justify-center gap-1.5"
            >
              📄 View Invoice
            </button>
            <button
              onClick={onBookTransport}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold py-3 rounded-md transition flex items-center justify-center gap-1.5"
            >
              🚚 Book Transport
            </button>
            <button
              onClick={onBackToAuctions}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold py-3 rounded-md transition flex items-center justify-center gap-1.5"
            >
              &larr; Auctions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
