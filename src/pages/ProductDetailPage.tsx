import React, { useState } from 'react';

interface ProductDetailPageProps {
  onBackToMarketplace: () => void;
  onBuyNow: (orderData: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onBackToMarketplace,
  onBuyNow,
}) => {
  const [qty, setQty] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'credit' | 'upi'>('wallet');

  const unitPrice = 19.5;
  const platformFee = 0;
  const total = qty * unitPrice + platformFee;

  const handleIncrement = () => {
    setQty((prev) => prev + 100);
  };

  const handleDecrement = () => {
    setQty((prev) => (prev > 100 ? prev - 100 : 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuyNow({
      productName: 'Paddy (Ponni)',
      qty,
      total,
      paymentMethod,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToMarketplace} className="hover:text-slate-600 underline">Marketplace</button>
        <span className="mx-1.5">&rsaquo;</span>
        <button onClick={onBackToMarketplace} className="hover:text-slate-600 underline">Paddy</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Paddy (Ponni) &mdash; Grade A</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Paddy (Ponni) &mdash; Grade A</h1>
      </div>

      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Images, specs, info) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          {/* Large thumbnail */}
          <div className="h-60 bg-emerald-50/70 flex items-center justify-center text-7xl border-b border-slate-100">
            🌾
          </div>

          <div className="p-6 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-800">Paddy (Ponni)</h2>
                <div className="flex gap-1.5">
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-sm">
                    Grade A
                  </span>
                  <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-sm">
                    Certified
                  </span>
                </div>
              </div>
              <div className="text-2xl font-black text-[#1b4d4f]">
                ₹19.50<span className="text-xs font-semibold text-slate-400">/kg</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Available Qty</span>
                <span>10 MT (10,000 kg)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Moisture</span>
                <span>13.5%</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Origin</span>
                <span>Thoothukudi, TN</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">Harvest</span>
                <span>July 2025</span>
              </div>
              <div className="space-y-0.5 col-span-2">
                <span className="text-[10px] text-slate-400 font-normal block">Seller</span>
                <span>Murugan Kandasamy (Agent) &bull; <span className="text-amber-400">★★★★★</span> 4.9</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <p className="text-xs text-slate-500 leading-relaxed">
              High quality Ponni variety paddy. Moisture tested and certified. Direct from farm, aggregated by verified mandi agent. Suitable for milling and retail.
            </p>
          </div>
        </div>

        {/* Right Column (Checkout / Order widgets) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Order Details</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Quantity (kg)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-10 h-10 border border-slate-350 bg-slate-50 rounded-md text-sm font-bold text-slate-700 flex items-center justify-center hover:bg-slate-100"
                >
                  -
                </button>
                <input
                  type="text"
                  value={qty.toLocaleString()}
                  readOnly
                  className="w-24 h-10 border border-slate-350 rounded-md text-center text-sm font-bold text-slate-800 outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-10 h-10 border border-slate-350 bg-slate-50 rounded-md text-sm font-bold text-slate-700 flex items-center justify-center hover:bg-slate-100"
                >
                  +
                </button>
                <span className="text-xs text-slate-400 font-bold ml-1">kg</span>
              </div>
            </div>

            {/* Calculations */}
            <div className="divide-y divide-slate-150 text-xs font-semibold text-slate-650">
              <div className="flex justify-between py-2.5">
                <span>{qty.toLocaleString()} kg &times; ₹19.50</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Platform Fee</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between py-3 text-sm font-bold text-[#1b4d4f]">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">PAYMENT METHOD</span>
              <div className="space-y-2">
                {/* Wallet option */}
                <label
                  onClick={() => setPaymentMethod('wallet')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition
                    ${paymentMethod === 'wallet'
                      ? 'border-[#1b4d4f] bg-[#e2f2f1]/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wallet'}
                    readOnly
                    className="text-[#1b4d4f] focus:ring-[#1b4d4f]"
                  />
                  <div className="text-xs font-semibold">
                    <p className="text-slate-800">Wallet Balance</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Available: ₹18,000</p>
                  </div>
                </label>

                {/* Credit Option */}
                <label
                  onClick={() => setPaymentMethod('credit')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition
                    ${paymentMethod === 'credit'
                      ? 'border-[#1b4d4f] bg-[#e2f2f1]/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'credit'}
                    readOnly
                    className="text-[#1b4d4f] focus:ring-[#1b4d4f]"
                  />
                  <div className="text-xs font-semibold">
                    <p className="text-slate-800">Credit Limit</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Available: ₹50,000</p>
                  </div>
                </label>

                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition
                    ${paymentMethod === 'upi'
                      ? 'border-[#1b4d4f] bg-[#e2f2f1]/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    readOnly
                    className="text-[#1b4d4f] focus:ring-[#1b4d4f]"
                  />
                  <div className="text-xs font-semibold">
                    <p className="text-slate-800">UPI / Online Payment</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Razorpay &mdash; Instant</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onBackToMarketplace}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold py-3 rounded-md transition text-center"
              >
                + Add to Cart
              </button>
              <button
                type="submit"
                className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-3 rounded-md transition shadow-xs text-center"
              >
                Buy Now &mdash; ₹{total.toLocaleString()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
