import React from 'react';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

interface CartItem {
  name: string;
  emoji: string;
  pricePerKg: number;
  qty: number;
}

interface OrderSuccessPageProps {
  orderSummary: {
    items: CartItem[];
    subtotal: number;
    paymentMethod: string;
    deliveryAddress: string;
  } | null;
  onBackToMarketplace: () => void;
  onBookTransport: () => void;
  onRateTransaction?: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderSummary,
  onBackToMarketplace,
  onBookTransport,
  onRateTransaction,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  // Mock fallback to Paddy Grade A (5 MT) as shown in mockup
  const items = orderSummary?.items || [
    { name: 'Paddy (Ponni) Grade A — 100 kg bags', emoji: '🌾', pricePerKg: 195, qty: 5000 },
  ];
  
  const produceValue = orderSummary?.subtotal ?? 975000;
  const deliveryAddress = orderSummary?.deliveryAddress ?? 'Kumar Agro Traders, Kayamozhi Road, Thoothukudi – 628213';

  // Calculations (Removed Commission & GST as requested)
  const subtotal = produceValue;
  const totalPayable = subtotal;

  const invoiceNumber = orderSummary?.subtotal === 26000 ? 'INV-9012' : 'INV-2295';
  const auctionLot = orderSummary?.subtotal === 26000 ? 'Fixed Price' : 'Lot #A-2295';

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Top Header Row with Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 print:hidden">
        <div>
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-400">{t('purchase', 'Purchase')} #ORD-2295</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">{t('invoice', 'Invoice')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('invoice', 'Invoice')} &mdash; {invoiceNumber}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-start sm:self-center">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition"
          >
            📥 {t('download_pdf', 'Download PDF')}
          </button>
          <button
            onClick={() => showToast(t('sharing_whatsapp', 'Sharing invoice via WhatsApp...'), 'info')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition"
          >
            💬 {t('share_whatsapp', 'Share via WhatsApp')}
          </button>
        </div>
      </div>

      {/* Main Tax Invoice Sheet */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 space-y-8 relative overflow-hidden">
        
        {/* Header Block: Logo Placeholder & Details */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-black text-[#1b4d4f]">Murugan Kandasamy</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">{t('mandi_agent', 'Mandi Agent')} | Thoothukudi APMC</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">GSTIN: 33XXXXX1332L1ZT</p>
            <p className="text-[10px] text-slate-400 font-bold">{t('mobile', 'Mobile:')} +91 94440 00001</p>
          </div>

          <div className="md:text-right">
            <h2 className="text-xl font-black text-slate-800 tracking-wider">{t('tax_invoice', 'TAX INVOICE')}</h2>
            <p className="text-xs text-slate-700 font-bold mt-1">
              <span className="text-slate-400 font-normal">{t('invoice', 'Invoice')}:</span> {invoiceNumber}
            </p>
            <p className="text-xs text-slate-700 font-bold">
              <span className="text-slate-400 font-normal">{t('date', 'Date:')}</span> 15 Jul 2025
            </p>
            <p className="text-xs text-slate-700 font-bold">
              <span className="text-slate-400 font-normal">{t('auction_label', 'Auction:')}</span> {auctionLot}
            </p>
          </div>
        </div>

        {/* Bill To Details Block */}
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-md">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">{t('bill_to', 'Bill To')}</span>
          <p className="text-xs font-black text-slate-800">Kumar Agro Traders (Ravi Kumar)</p>
          <p className="text-xs text-slate-650 font-bold mt-0.5">{deliveryAddress}</p>
          <p className="text-[10px] text-slate-500 font-bold mt-1.5">
            GSTIN: 33AXXXX1332L1ZT | {t('mobile', 'Mobile:')} +91 98765 43210
          </p>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-150 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150 uppercase tracking-wider text-[10px]">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">{t('description', 'Description')}</th>
                <th className="p-3 text-right">{t('qty', 'Qty')}</th>
                <th className="p-3 text-right">{t('rate', 'Rate')}</th>
                <th className="p-3 text-right">{t('amount', 'Amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {items.filter(item => !item.name.toLowerCase().includes('commission')).map((item, idx) => {
                const bagsCount = Math.ceil(item.qty / 100);
                const rateText = item.pricePerKg === 195 ? '₹19,500/qtl' : `₹${(item.pricePerKg * 100).toLocaleString()}/qtl`;
                const qtyText = item.qty === 5000 ? `50 ${t('bags', 'bags')} (5,000 kg)` : `${bagsCount} ${t('bags', 'bags')} (${item.qty.toLocaleString()} kg)`;
                return (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                    <td className="p-3 text-right text-slate-600">{qtyText}</td>
                    <td className="p-3 text-right text-slate-650">{rateText}</td>
                    <td className="p-3 text-right text-slate-850">₹{produceValue.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Stack (right aligned) */}
        <div className="flex justify-end pt-4">
          <div className="w-80 space-y-2 text-xs font-bold text-slate-650">
            <div className="flex justify-between">
              <span className="text-slate-400 font-normal">{t('subtotal', 'Subtotal')}</span>
              <span>₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            
            {/* Total Payable row */}
            <div className="flex justify-between py-3 border-t border-slate-100 text-sm font-black text-[#1b4d4f] bg-cyan-50/20 px-2 rounded">
              <span>{t('total_payable', 'Total Payable')}</span>
              <span className="text-base font-black text-[#1b4d4f]">₹{totalPayable.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Settlement Status alert */}
        <div className="bg-emerald-50/50 border-l-4 border-emerald-500 p-3 rounded text-xs font-semibold text-emerald-800">
          ✓ {t('payment_settled_wallet', 'Payment settled from Wallet on 15 Jul 2025')}
        </div>

        {/* Footer info brand */}
        <div className="text-center text-[9px] text-slate-400 font-bold border-t border-slate-100 pt-6">
          {t('powered_by', 'Powered by Velaan Bay Buyer Portal | buyer.velaanbay.in | Skandavel Webtech Pvt. Ltd.')}
        </div>

      </div>

      {/* Navigation Return bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBookTransport}
          className="flex-1 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-3 rounded-md transition text-center shadow-xs"
        >
          🚚 {t('book_transport', 'Book Transport')}
        </button>
        {onRateTransaction && (
          <button
            onClick={onRateTransaction}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-3 rounded-md transition text-center shadow-xs"
          >
            ⭐ {t('rate_transaction', 'Rate Transaction')}
          </button>
        )}
        <button
          onClick={onBackToMarketplace}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold py-3 rounded-md transition text-center"
        >
          🛍 {t('continue_sourcing', 'Continue Sourcing')}
        </button>
      </div>

    </div>
  );
};
