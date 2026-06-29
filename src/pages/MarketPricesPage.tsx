import React, { useState, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { AgriLoader } from '../components/AgriLoader';
import { useTranslation } from 'react-i18next';

interface PriceRow {
  commodity: string;
  variety: string;
  price: number | string;
  unit: string;
  updatedTime: string;
  date: string;
  marketName: string;
  districtName: string;
}

export const MarketPricesPage: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  // Set default to 2026-06-17 for demo purposes
  const defaultDate = '2026-06-17';

  // Temp State (Unapplied filters)
  const [tempDate, setTempDate] = useState<string>(defaultDate);
  const [tempDistrict, setTempDistrict] = useState<any>(null);
  const [tempMarket, setTempMarket] = useState<any>(null);
  const [tempCommodity, setTempCommodity] = useState<any>(null);
  const [tempVariety, setTempVariety] = useState<any>(null);

  // Applied State (Triggers data fetch)
  const [appliedFilters, setAppliedFilters] = useState({
    date: defaultDate,
    district: null as any,
    market: null as any,
    commodity: null as any,
    variety: null as any
  });

  const [downloading, setDownloading] = useState(false);

  // Queries
  const { data: filterData } = useQuery({
    queryKey: ['market-filters', tempDate],
    queryFn: async () => {
      const currentLang = localStorage.getItem('buyer_language') || 'en';
      const params = new URLSearchParams({ lan: currentLang });
      if (tempDate) params.append('price_date', tempDate);
      const res = await axios.get(`http://localhost:6200/marketPrice/market-price-v2?${params.toString()}`);
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: pricesResponse, isLoading } = useQuery({
    queryKey: ['market-prices', appliedFilters],
    queryFn: async () => {
      const currentLang = localStorage.getItem('buyer_language') || 'en';
      const params = new URLSearchParams({ lan: currentLang });
      if (appliedFilters.date) params.append('price_date', appliedFilters.date);
      if (appliedFilters.district?.value) params.append('district_id', appliedFilters.district.value);
      if (appliedFilters.market?.value) params.append('market_id', appliedFilters.market.value);
      if (appliedFilters.commodity?.value) params.append('product_id', appliedFilters.commodity.value);
      // Backend does not have variety_id filter. So we fetch and filter varieties locally.
      const res = await axios.get(`http://localhost:6200/marketPrice/market-price-v2?${params.toString()}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  // Extract filters from filterData
  const filterOptions = useMemo(() => {
    const dists = new Map();
    const mrkts = new Map();
    const prods = new Map();
    const vars = new Set<string>();

    if (filterData) {
      filterData.forEach((market: any) => {
        if (market.district_id) dists.set(market.district_id, market.district);
        if (market.market_id) {
          mrkts.set(market.market_id, { name: market.market_name, district_id: market.district_id });
        }
        market.products.forEach((product: any) => {
          if (product.product_id) prods.set(product.product_id, product.product_name);
          product.varieties.forEach((variety: any) => {
            if (variety.variety_name) vars.add(variety.variety_name);
          });
        });
      });
    }

    const allMarkets = Array.from(mrkts, ([id, val]) => ({ value: id.toString(), label: val.name, district_id: val.district_id }));

    return {
      districts: Array.from(dists, ([id, name]) => ({ value: id.toString(), label: name })),
      allMarkets,
      displayMarkets: tempDistrict?.value
        ? allMarkets.filter(m => m.district_id.toString() === tempDistrict.value)
        : allMarkets,
      commodities: Array.from(prods, ([id, name]) => ({ value: id.toString(), label: name })),
      varieties: Array.from(vars).map(name => ({ value: name, label: name }))
    };
  }, [filterData, tempDistrict]);

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).toUpperCase();
  };

  const processedData = useMemo(() => {
    const flatPrices: PriceRow[] = [];
    let latestUpdate = '';
    const data = pricesResponse?.data || [];

    data.forEach((market: any) => {
      market.products.forEach((product: any) => {
        product.varieties.forEach((variety: any) => {
          const formattedDate = formatDateTime(variety.updated_at);
          const varietyName = variety.variety_name || '-';

          // Apply client-side variety filter since backend doesn't support variety_id
          if (appliedFilters.variety?.value && varietyName !== appliedFilters.variety.value) {
            return;
          }

          flatPrices.push({
            commodity: product.product_name,
            variety: varietyName,
            price: variety.price,
            unit: variety.unit,
            updatedTime: formattedDate,
            date: variety.date,
            marketName: market.market_name,
            districtName: market.district
          });

          if (!latestUpdate) latestUpdate = formattedDate;
        });
      });
    });
    return { flatPrices, latestUpdate, selectedDate: pricesResponse?.selected_date || '' };
  }, [pricesResponse, appliedFilters.variety]);

  const handleApplyFilter = () => {
    setAppliedFilters({
      date: tempDate,
      district: tempDistrict,
      market: tempMarket,
      commodity: tempCommodity,
      variety: tempVariety
    });
  };

  const handleDownloadCSV = () => {
    if (processedData.flatPrices.length === 0) {
      showToast(t('msg_no_data_download', "No data available to download."), "error");
      return;
    }

    setDownloading(true);
    showToast(t('msg_downloading_csv', "Downloading today's prices CSV..."), 'info');
    const headers = [
      t('table_district', 'District'),
      t('table_market', 'Market'),
      t('table_commodity', 'Commodity'),
      t('table_variety', 'Variety'),
      t('table_price', 'Price'),
      t('table_unit', 'Unit'),
      t('filter_date', 'Date'),
      t('table_last_updated', 'Last Updated')
    ];
    const csvContent = [
      headers.join(','),
      ...processedData.flatPrices.map(item =>
        `"${item.districtName}","${item.marketName}","${item.commodity}","${item.variety}","${item.price}","${item.unit}","${item.date}","${item.updatedTime}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Overall_Market_Prices_${processedData.selectedDate || 'Today'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
    showToast(t('msg_download_complete', "Download complete!"), 'success');
  };

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '42px',
      borderColor: '#cbd5e1',
      boxShadow: 'none',
      '&:hover': { borderColor: '#1b4d4f' },
      cursor: 'pointer'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#1b4d4f' : state.isFocused ? '#f1f5f9' : 'white',
      color: state.isSelected ? 'white' : '#334155',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: '13px',
      fontWeight: '600',
      color: '#334155'
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '13px',
      fontWeight: '600',
      color: '#94a3b8'
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50
    })
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-450">{t('nav_home', 'Home')}</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">{t('nav_market_prices', 'Market Prices')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('title_market_price_list', 'Market Price List')}</h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            {t('desc_market_price_list', 'Daily commodity prices across Indian APMC markets. Updated by Velaan Bay back office.')}
          </p>
        </div>

        <div className="self-start sm:self-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-md shadow-xs uppercase tracking-wider">
            ✓ {t('badge_no_login_required', 'No Login Required')}
          </span>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3.5 flex gap-2.5 items-center">
        <span className="text-blue-500 text-lg">📢</span>
        <p className="text-xs text-blue-800 font-semibold">
          {t('alert_prices_updated', 'Prices are updated daily by the Velaan Bay back office. Last updated:')}{' '}
          <span className="text-[#1b4d4f] font-black">{processedData.latestUpdate || t('loading', 'Loading...')}</span>
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">

          <div className="lg:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">{t('filter_date', 'Date')}</label>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full h-[42px] px-3 border border-slate-300 rounded-md bg-white text-slate-700 text-[13px] font-semibold focus:border-[#1b4d4f] outline-none"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">{t('filter_district', 'District')}</label>
            <Select
              isClearable
              options={filterOptions.districts}
              value={tempDistrict}
              onChange={(val) => { setTempDistrict(val); setTempMarket(null); }}
              placeholder="All"
              styles={customSelectStyles}
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">{t('filter_market', 'Market')}</label>
            <Select
              isClearable
              options={filterOptions.displayMarkets}
              value={tempMarket}
              onChange={(val) => setTempMarket(val)}
              placeholder="All"
              styles={customSelectStyles}
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">{t('filter_commodity', 'Commodity')}</label>
            <Select
              isClearable
              options={filterOptions.commodities}
              value={tempCommodity}
              onChange={(val) => setTempCommodity(val)}
              placeholder="All"
              styles={customSelectStyles}
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">{t('filter_variety', 'Variety')}</label>
            <Select
              isClearable
              options={filterOptions.varieties}
              value={tempVariety}
              onChange={(val) => setTempVariety(val)}
              placeholder="All"
              styles={customSelectStyles}
            />
          </div>

          <div className="lg:col-span-1 flex gap-2">
            <button
              onClick={handleApplyFilter}
              className="flex-1 h-[42px] bg-[#1b4d4f] hover:bg-[#123637] text-white text-[13px] font-bold rounded-md shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              ⚙ {t('btn_filter', 'Filter')}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleDownloadCSV}
            disabled={downloading}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-[13px] font-bold rounded-md shadow-2xs flex items-center gap-2 transition cursor-pointer"
          >
            {downloading ? `⏳ ${t('btn_preparing', 'Preparing...')}` : `📊 ${t('btn_download_prices', "Download Today's Prices")}`}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center text-xs font-bold">
          <span className="text-slate-800 font-extrabold">{processedData.selectedDate ? `${t('filter_date', 'Date')} — ${processedData.selectedDate}` : t('text_select_date', 'Select a date')}</span>
          <span className="text-slate-400 font-semibold text-[10px]">{t('text_prices_unit', 'Prices in appropriate unit')}</span>
        </div>

        <div className="overflow-x-auto relative min-h-[400px] max-h-[600px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <AgriLoader message="Loading market prices..." />
            </div>
          )}
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <tr className="text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-4">{t('table_district', 'District')}</th>
                <th className="p-4">{t('table_market', 'Market')}</th>
                <th className="p-4">{t('table_commodity', 'Commodity')}</th>
                <th className="p-4">{t('table_variety', 'Variety')}</th>
                <th className="p-4">{t('table_price', 'Price')}</th>
                <th className="p-4">{t('table_unit', 'Unit')}</th>
                <th className="p-4">{t('table_last_updated', 'Last Updated')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {processedData.flatPrices.length > 0 ? processedData.flatPrices.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-slate-650">{item.districtName}</td>
                  <td className="p-4 text-slate-650">{item.marketName}</td>
                  <td className="p-4 text-slate-900 font-extrabold">{item.commodity}</td>
                  <td className="p-4 text-slate-650">{item.variety}</td>
                  <td className="p-4 text-[#1b4d4f] font-black text-sm">₹{Number(item.price).toLocaleString()}</td>
                  <td className="p-4 text-slate-500">{item.unit}</td>
                  <td className="p-4 text-slate-500 font-bold whitespace-nowrap">{item.updatedTime}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 font-semibold text-sm">{t('msg_no_prices', 'No prices found for the selected filters.')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-bold leading-relaxed">
        {t('disclaimer_market_prices', 'Disclaimer: Prices are indicative and sourced from APMC market data. Actual transaction prices may vary. Maintained by Skandavel Webtech Private Limited.')}
      </div>
    </div>
  );
};
