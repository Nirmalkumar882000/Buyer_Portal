import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FeedbackPageProps {
  agentName?: string;
  agentInitials?: string;
  agentRole?: string;
  market?: string;
  transactionLabel?: string;
  orderId?: string;
  onSubmit: () => void;
  onBack: () => void;
}

// ── Star Row Component ────────────────────────────────────────────────────────

const StarRating: React.FC<{
  value: number;
  onChange: (v: number) => void;
  size?: 'sm' | 'lg';
}> = ({ value, onChange, size = 'sm' }) => {
  const [hovered, setHovered] = useState(0);
  const starSize = size === 'lg' ? 'text-4xl' : 'text-xl';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`${starSize} transition-transform duration-100 hover:scale-110 leading-none focus:outline-none`}
            aria-label={`Rate ${star} stars`}
          >
            <span className={filled ? 'text-amber-400' : 'text-slate-200'}>★</span>
          </button>
        );
      })}
    </div>
  );
};

// ── Label map ─────────────────────────────────────────────────────────────────

const scoreLabel = (v: number) => {
  if (v === 5) return 'Excellent';
  if (v === 4) return 'Very Good';
  if (v === 3) return 'Good';
  if (v === 2) return 'Fair';
  if (v === 1) return 'Poor';
  return 'Tap to rate';
};

// ── Category Row ──────────────────────────────────────────────────────────────

const CategoryRow: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-sm font-semibold text-slate-700 w-52">{label}</span>
    <div className="flex items-center gap-3">
      <StarRating value={value} onChange={onChange} size="sm" />
      <span className="text-[11px] text-slate-400 font-semibold w-16 text-right">
        {value > 0 ? `${value}.0 — ${scoreLabel(value)}` : '—'}
      </span>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  agentName     = 'Murugan Kandasamy',
  agentInitials = 'MK',
  agentRole     = 'Mandi Agent',
  market        = 'Thoothukudi APMC',
  transactionLabel = 'Paddy 5 MT — ₹9,75,000',
  orderId       = 'ORD-2295',
  onSubmit,
  onBack,
}) => {
  const { showToast } = useToast();

  // ── Ratings state ─────────────────────────────────────────────────────────
  const [overallRating, setOverallRating] = useState(5);
  const [catRatings, setCatRatings] = useState({
    quality:      5,
    accuracy:     4,
    communication: 5,
    delivery:     5,
  });
  const [review, setReview] = useState(
    'Excellent agent! Paddy quality was exactly as described – Grade A with 13.8% moisture. Settlement was fast and communication was very responsive. Highly recommend Murugan Kandasamy for paddy purchases.'
  );
  const [submitted, setSubmitted] = useState(false);

  const avgCategory = (
    (catRatings.quality + catRatings.accuracy + catRatings.communication + catRatings.delivery) / 4
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overallRating === 0) {
      showToast('Please select an overall star rating before submitting.', 'warning');
      return;
    }
    if (!review.trim()) {
      showToast('Please write a short review before submitting.', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Review submitted! Thank you for your feedback.', 'success');
    setTimeout(() => onSubmit(), 1800);
  };

  // ── Success State ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl">
          ✅
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-slate-800">Review Submitted!</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Your feedback has been published on <strong>{agentName}</strong>'s profile and will help other buyers.
          </p>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-3xl">
          {'★'.repeat(overallRating)}{'☆'.repeat(5 - overallRating)}
        </div>
        <p className="text-xs text-slate-400">Redirecting to Dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-2xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <div className="text-xs text-slate-400 font-medium mb-1">
          <button onClick={onBack} className="hover:text-slate-600 underline">Purchase #{orderId}</button>
          <span className="mx-1.5">›</span>
          <span className="text-slate-500 font-semibold">Rate &amp; Review</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rate Your Transaction</h1>
        <p className="text-xs text-slate-400 mt-0.5">Help other buyers by sharing your experience</p>
      </div>

      {/* ── Main Card ─────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm space-y-0 overflow-hidden">

          {/* Transaction Context */}
          <div className="flex items-center gap-4 px-7 py-5 bg-slate-50 border-b border-slate-200">
            <div className="w-12 h-12 rounded-full bg-[#1b4d4f] text-white flex items-center justify-center text-sm font-black shrink-0 shadow-sm">
              {agentInitials}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{agentName}</p>
              <p className="text-[11px] text-slate-400 font-medium">{agentRole} | {market}</p>
              <p className="text-[11px] text-[#1b4d4f] font-bold mt-0.5">Transaction: {transactionLabel}</p>
            </div>
          </div>

          <div className="px-7 py-6 space-y-6">
            {/* ── Overall Rating ─────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Rating</p>
              <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
              <p className={`text-sm font-black transition-all ${overallRating > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                {overallRating > 0 ? `${overallRating}.0 — ${scoreLabel(overallRating)}` : 'Tap to rate'}
              </p>
            </div>

            {/* ── Category Ratings ───────────────────────────────────────── */}
            <div className="border border-slate-200 rounded-lg px-5 py-1 bg-slate-50/30">
              <CategoryRow label="Product Quality" value={catRatings.quality}
                onChange={(v) => setCatRatings(r => ({ ...r, quality: v }))} />
              <CategoryRow label="Accuracy of Description" value={catRatings.accuracy}
                onChange={(v) => setCatRatings(r => ({ ...r, accuracy: v }))} />
              <CategoryRow label="Communication" value={catRatings.communication}
                onChange={(v) => setCatRatings(r => ({ ...r, communication: v }))} />
              <CategoryRow label="Delivery &amp; Logistics" value={catRatings.delivery}
                onChange={(v) => setCatRatings(r => ({ ...r, delivery: v }))} />
            </div>

            {/* Category average pill */}
            <div className="flex justify-end">
              <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                Category avg: <strong className="text-slate-700">{avgCategory} / 5.0</strong>
              </span>
            </div>

            {/* ── Review Text ────────────────────────────────────────────── */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Your Review / Comments
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                placeholder="Describe your experience with this agent — product quality, communication, speed of delivery…"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f] resize-none transition leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 text-right">{review.length} / 500 characters</p>
            </div>

            {/* ── Submit CTA ─────────────────────────────────────────────── */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-sm font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-2"
              >
                ✓ Submit Review
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Your review will be published publicly on the agent's profile and stored in your transaction history. Thank you!
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* ── Info note ─────────────────────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-[10px] text-blue-700 font-semibold leading-relaxed flex items-start gap-2">
        <span className="text-sm shrink-0">ℹ️</span>
        <span>
          Submitted reviews are moderated by Velaan Bay within 24 hours before going live.
          Reviews directly improve the platform's trust score and help buyers make informed decisions.
        </span>
      </div>
    </div>
  );
};
