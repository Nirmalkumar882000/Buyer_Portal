import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface PostDemandPageProps {
  onPostDemandSuccess: (newDemand: {
    produce: string;
    qty: string;
    targetPrice: string;
    delivery: string;
    grade: string;
    notes: string;
    deadlineDate: string;
  }) => void;
  onCancel: () => void;
}

export const PostDemandPage: React.FC<PostDemandPageProps> = ({
  onPostDemandSuccess,
  onCancel,
}) => {
  const { showToast } = useToast();
  const [commodity, setCommodity] = useState('Paddy / Rice');
  const [variety, setVariety] = useState('Ponni');
  const [qty, setQty] = useState('5,000');
  const [qtyUnit, setQtyUnit] = useState('kg');
  const [targetPrice, setTargetPrice] = useState('18,500');
  const [priceUnit, setPriceUnit] = useState('/qtl');
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [deliveryLocation, setDeliveryLocation] = useState('Thoothukudi');
  const [deadlineDate, setDeadlineDate] = useState('2025-07-25');
  const [preferredState, setPreferredState] = useState('Tamil Nadu');
  const [notes, setNotes] = useState(
    'Prefer Grade A Ponni variety. Moisture below 14%. Can arrange pickup from mandi or pay for transport to Thoothukudi.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qty || !targetPrice || !deliveryLocation) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    onPostDemandSuccess({
      produce: `${commodity} (${variety || 'Grade A'})`,
      qty: `${qty} ${qtyUnit}`,
      targetPrice: `₹${targetPrice}${priceUnit}`,
      delivery: deliveryLocation,
      grade: `${qualityGrade}, ${notes.split('.')[0]}`,
      notes,
      deadlineDate: new Date(deadlineDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onCancel} className="hover:text-slate-600 underline">Demand Board</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Post New Demand</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Post New Demand</h1>
        <p className="text-xs text-slate-500 mt-1">Let farmers and agents know what you're looking to buy</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <span className="text-xs font-bold text-[#1b4d4f] border-b border-[#1b4d4f] pb-1 block w-max uppercase tracking-wider">
            Demand Details
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Commodity Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Commodity Type *</label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
              >
                <option>Paddy / Rice</option>
                <option>Groundnut</option>
                <option>Onion</option>
                <option>Tomato</option>
                <option>Wheat</option>
              </select>
            </div>

            {/* Variety / Grade */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Variety / Grade</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Ponni, Grade A"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-semibold"
              />
            </div>

            {/* Quantity Required */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Quantity Required *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="e.g. 5,000"
                  className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-extrabold"
                  required
                />
                <select
                  value={qtyUnit}
                  onChange={(e) => setQtyUnit(e.target.value)}
                  className="w-20 text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
                >
                  <option>kg</option>
                  <option>MT</option>
                  <option>qtl</option>
                </select>
              </div>
            </div>

            {/* Target Price */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Target Price *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 18,500"
                  className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-extrabold"
                  required
                />
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-20 text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
                >
                  <option>/qtl</option>
                  <option>/kg</option>
                  <option>/MT</option>
                </select>
              </div>
            </div>

            {/* Quality Grade */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Quality Grade *</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
              >
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Premium</option>
                <option>Any Grade</option>
              </select>
            </div>

            {/* Delivery Location */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Delivery Location *</label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Thoothukudi"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-semibold"
                required
              />
            </div>

            {/* Required By Date Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Required By (Deadline) *</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-semibold"
                required
              />
            </div>

            {/* Preferred State / Region */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Preferred State / Region</label>
              <select
                value={preferredState}
                onChange={(e) => setPreferredState(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
              >
                <option>Tamil Nadu</option>
                <option>Karnataka</option>
                <option>Andhra Pradesh</option>
                <option>Maharashtra</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter special requirements or pickup instructions..."
              rows={3}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-medium"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold rounded-md transition shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md transition shadow-xs flex items-center gap-1.5"
            >
              Post Demand &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
