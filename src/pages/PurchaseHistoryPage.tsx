import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import { fetchBuyerReports } from '../api/reports';
import { AgriLoader } from '../components/AgriLoader';
interface PurchaseItem {
  date: string;
  orderId: string;
  product: string;
  variety?: string;
  qty: string;
  totalValue: number;
  seller: string;
  channel: 'Auction' | 'Fixed Price';
  status: string;
  pricePerKg: number;
  qtyNum: number;
  agentName?: string;
  basePrice?: number;
  biddingPrice?: number;
}

interface PurchaseHistoryPageProps {
  onViewInvoice: (orderSummary: any) => void;
  deliveryAddress: string;
}

export const PurchaseHistoryPage: React.FC<PurchaseHistoryPageProps> = ({
  onViewInvoice,
  deliveryAddress,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedSeller, setSelectedSeller] = useState('All');
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchBuyerReports({ limit: 100 });
        if (res.success && res.data && res.data.rows) {
          setPurchases(res.data.rows);
          setFilteredPurchases(res.data.rows);
        }
      } catch (err) {
        showToast(t('error_loading_history', 'Error loading purchase history'), 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = () => {
    // Dynamic filter logic
    const results = purchases.filter((item) => {
      // Product Filter
      if (selectedProduct !== 'All' && !item.product.toLowerCase().includes(selectedProduct.toLowerCase())) {
        return false;
      }
      // Seller Filter
      if (selectedSeller !== 'All' && item.seller !== selectedSeller) {
        return false;
      }
      // Date Filter
      const itemTime = new Date(item.date).getTime();
      if (fromDate) {
        const fromTime = new Date(fromDate).getTime();
        if (itemTime < fromTime) return false;
      }
      if (toDate) {
        const toTime = new Date(toDate).getTime();
        if (itemTime > toTime) return false;
      }
      return true;
    });
    setFilteredPurchases(results);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleView = (item: PurchaseItem) => {
    onViewInvoice({
      items: [
        {
          name: item.variety ? `${item.product} — ${item.variety}` : item.product,
          pricePerKg: item.pricePerKg,
          qty: item.qtyNum,
        },
      ],
      subtotal: item.totalValue,
      paymentMethod: 'wallet',
      deliveryAddress,
    });
  };

  const totalValueSum = filteredPurchases.reduce((acc, curr) => acc + curr.totalValue, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-450">{t('home', 'Home')}</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">{t('purchase_history', 'Purchase History')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('purchase_history', 'Purchase History')}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-start sm:self-center">
          <button
            onClick={() => showToast(t('exporting_csv', 'Exporting purchase history to CSV...'), 'info')}
            className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition"
          >
            ⬇ {t('export_csv', 'Export CSV')}
          </button>
          <button
            onClick={() => showToast(t('downloading_pdf', 'Downloading PDF report...'), 'info')}
            className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition"
          >
            📄 {t('download_pdf', 'Download PDF')}
          </button>
        </div>
      </div>

      {/* Filter Bar Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-slate-450 text-[10px] uppercase tracking-wide">{t('date', 'Date:')}</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          />
          <span className="text-slate-400 font-normal">{t('to', 'to')}</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          />
        </div>

        {/* Commodity Dropdown */}
        <div className="flex-1 min-w-[140px]">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          >
            <option value="All">{t('all_commodities', 'All Commodities')}</option>
            <option value="Paddy">Paddy</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Onion">Onion</option>
            <option value="Wheat">Wheat</option>
            <option value="Turmeric">Turmeric</option>
          </select>
        </div>

        {/* Seller Dropdown */}
        <div className="flex-1 min-w-[160px]">
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          >
            <option value="All">{t('all_sellers', 'All Sellers')}</option>
            <option value="Murugan K. (Agent)">Murugan K. (Agent)</option>
            <option value="Rajan Farm">Rajan Farm</option>
            <option value="Arjunan N. (Agent)">Arjunan N. (Agent)</option>
            <option value="Pandiyan K. (Agent)">Pandiyan K. (Agent)</option>
          </select>
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md shadow-xs transition flex items-center gap-1.5"
        >
          🔍 {t('search', 'Search')}
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-4">{t('date_col', 'Date')}</th>
                <th className="p-4">{t('order_id_col', 'Order ID')}</th>
                <th className="p-4">{t('product_col', 'Product')}</th>
                <th className="p-4">{t('qty_col', 'Qty')}</th>
                <th className="p-4">{t('total_value_col', 'Total Value')}</th>
                <th className="p-4">{t('seller_col', 'Seller')}</th>
                <th className="p-4">{t('channel_col', 'Channel')}</th>
                <th className="p-4">{t('status_col', 'Status')}</th>
                <th className="p-4 text-center">{t('invoice_col', 'Invoice')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex justify-center items-center py-8">
                      <AgriLoader />
                    </div>
                  </td>
                </tr>
              ) : paginatedPurchases.length > 0 ? (
                paginatedPurchases.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 text-slate-500">{item.date}</td>
                    <td className="p-4 text-slate-800 font-mono text-[11px]">{item.orderId}</td>
                    <td className="p-4 flex flex-col justify-center">
                      <span className="font-bold text-slate-800">{item.product}</span>
                      {item.variety && <span className="text-[10px] text-slate-500 font-semibold">{item.variety}</span>}
                    </td>
                    <td className="p-4 text-slate-800">{item.qty}</td>
                    <td className="p-4 text-slate-900 font-extrabold">₹{item.totalValue.toLocaleString()}</td>
                    <td className="p-4 text-slate-650">{item.seller}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-xs text-[9px] font-bold border ${item.channel === 'Auction'
                          ? 'bg-blue-50 border-blue-100 text-blue-700'
                          : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                          }`}
                      >
                        {item.channel === 'Auction' ? t('auction_channel', 'Auction') : t('fixed_price_channel', 'Fixed Price')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${item.status === 'Delivered'
                          ? 'bg-emerald-55/70 border border-emerald-200 text-emerald-800'
                          : item.status === 'In Transit'
                            ? 'bg-amber-50 border border-amber-250 text-amber-700'
                            : 'bg-blue-50 border border-blue-200 text-blue-800'
                          }`}
                      >
                        {item.status === 'Delivered' ? t('status_delivered', 'Delivered') : item.status === 'In Transit' ? t('status_in_transit', 'In Transit') : t('status_processing', 'Processing')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleView(item)}
                        className="px-3 py-1 bg-white border border-slate-350 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-md shadow-2xs transition inline-flex items-center gap-1"
                      >
                        📄 {t('view', 'View')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                    {t('no_purchases_found', 'No purchases found matching the filter criteria.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Statistics & Pagination bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
          <div className="text-slate-600 font-medium">
            {t('showing', 'Showing')} <span className="text-[#1b4d4f] font-bold">{paginatedPurchases.length}</span> {t('of_total_purchases', `of ${filteredPurchases.length} purchases`)} | {t('total_value', 'Total Value: ')}
            <span className="text-[#1b4d4f] font-black text-sm">₹{totalValueSum.toLocaleString()}</span>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md flex items-center justify-center font-bold shadow-xs transition ${
                  currentPage === page
                    ? 'bg-[#1b4d4f] text-white'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
