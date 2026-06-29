import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMarketLotView } from '../api/markets';
import { AgriLoader } from '../components/AgriLoader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

interface ProductDetailPageProps {
  onBackToMarketplace: () => void;
  onBuyNow: (orderData: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onBackToMarketplace,
  onBuyNow,
}) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const lotId = searchParams.get('lotId');
  const agentId = searchParams.get('agentId');
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>({});

  const [qty, setQty] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'credit' | 'upi'>('wallet');
  const [buying, setBuying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (lotId && agentId) {
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [lotId, agentId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const lan = localStorage.getItem('buyer_language') || 'en';
      const res = await getMarketLotView(lotId!, agentId!, lan);
      const parsed = res || {};

      setProductData(parsed);

      const minQty = parsed.lot_qty || 1;
      setQty(Number(minQty) > 0 ? Number(minQty) : 1);
    } catch (e) {
      console.error("Failed to fetch product details", e);
    } finally {
      setLoading(false);
    }
  };

  const unitPrice = Number(productData.base_price || 0);
  const platformFee = 0;
  const total = unitPrice + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showToast(t('err_login_purchase', 'Please log in to purchase.'), "error");

    try {
      setBuying(true);

      const rawBuyerUser = localStorage.getItem('buyer_user');
      let buyerId = 1;
      let mobileNumber = user.mobile || "0000000000";

      if (rawBuyerUser) {
        try {
          const parsed = JSON.parse(rawBuyerUser);
          buyerId = parsed.id || parsed.buyer_id || parsed.user_id || 1;
          if (parsed.mobile_number) mobileNumber = parsed.mobile_number;
        } catch (e) { }
      }

      const res = await api.post('/bidding/direct-sale', {
        lot_id: Number(lotId),
        buyer_id: buyerId,
        mobile_number: mobileNumber,
        amount: unitPrice,
        sales_type: "MARKET_SALE"
      });

      if (res.data?.success) {
        showToast(t('success_purchase', 'Purchase completed successfully!'), "success");
        onBuyNow({
          productName: productData.product_name || productData.product || 'Product',
          qty,
          total,
          paymentMethod,
          success: true
        });
      } else {
        showToast(res.data?.message || t('err_failed_purchase', 'Failed to complete purchase.'), "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || t('err_failed_purchase_sold', 'Failed to complete purchase. Product may already be sold.'), "error");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><AgriLoader message={t('loading_details', 'Loading details...')} inline /></div>;
  }

  const productName = productData.product_name || productData.product || 'Product';
  const variety = productData.variety || '';
  const sellerName = productData.agent_name || productData.agent_shop_name || 'Agent';
  const emoji = '📦';

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToMarketplace} className="hover:text-slate-600 underline">{t('marketplace', 'Marketplace')}</button>
        <span className="mx-1.5">&rsaquo;</span>
        <button onClick={onBackToMarketplace} className="hover:text-slate-600 underline">{productName}</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">{productName} {variety ? `— ${variety}` : ''}</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{productName} {variety ? `— ${variety}` : ''}</h1>
      </div>

      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Images, specs, info) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          {/* Large thumbnail */}
          <div className="h-60 bg-slate-50 flex items-center justify-center text-7xl border-b border-slate-100">
            {emoji}
          </div>

          <div className="p-6 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-800">{productName}</h2>
                <div className="flex gap-1.5">
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-sm">
                    {t('direct_sale', 'Direct Sale')}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-black text-[#1b4d4f]">
                ₹{unitPrice}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">{t('available_qty', 'Available Qty')}</span>
                <span>{productData.lot_qty || '-'} {productData.lot_unit || 'kg'}</span>
              </div>
              <div className="space-y-0.5 col-span-2">
                <span className="text-[10px] text-slate-400 font-normal block">{t('seller', 'Seller')}</span>
                <span>{sellerName}</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <p className="text-xs text-slate-500 leading-relaxed">
              {t('product_sourced_verified', 'Product sourced via verified agent platform. Fixed price direct sale.')}
            </p>
          </div>
        </div>

        {/* Right Column (Checkout / Order widgets) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">{t('order_details', 'Order Details')}</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">{t('fixed_lot_quantity', 'Fixed Lot Quantity')}</label>
              <div className="flex items-center gap-2">
                <div className="w-full h-10 px-3 border border-slate-350 bg-slate-50 rounded-md flex items-center text-sm font-bold text-slate-800">
                  {qty.toLocaleString()} {productData.lot_unit || ''}
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div className="divide-y divide-slate-150 text-xs font-semibold text-slate-650">
              <div className="flex justify-between py-2.5">
                <span>{t('lot_price', 'Lot Price')} ({qty.toLocaleString()} {productData.lot_unit || ''})</span>
                <span>₹{unitPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>{t('platform_fee', 'Platform Fee')}</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between py-3 text-sm font-bold text-[#1b4d4f]">
                <span>{t('total', 'Total')}</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">{t('payment_method', 'PAYMENT METHOD')}</span>
              <div className="space-y-2">
                <label onClick={() => setPaymentMethod('wallet')} className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition ${paymentMethod === 'wallet' ? 'border-[#1b4d4f] bg-[#e2f2f1]/40' : 'border-slate-200 bg-white hover:bg-slate-50/50'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'wallet'} readOnly className="text-[#1b4d4f] focus:ring-[#1b4d4f]" />
                  <div className="text-xs font-semibold">
                    <p className="text-slate-800">{t('wallet_balance', 'Wallet Balance')}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                type="submit"
                disabled={buying}
                className="w-full bg-[#1b4d4f] hover:bg-[#123637] disabled:opacity-50 text-white text-xs font-bold py-3 rounded-md transition shadow-xs text-center"
              >
                {buying ? t('processing', 'Processing...') : `${t('buy_now', 'Buy Now — ₹')}${total.toLocaleString()}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
