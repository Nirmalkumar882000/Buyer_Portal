import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { getAgentMarkets } from '../api/markets';
import { AgriLoader } from '../components/AgriLoader';

interface MarketDiscoveryPageProps {
  onBrowseAgents: (marketName: string) => void;
}

export const MarketDiscoveryPage: React.FC<MarketDiscoveryPageProps> = ({ onBrowseAgents }) => {
  const { t } = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Fetch all markets for filter options
  const { data: allMarketsResponse } = useQuery({
    queryKey: ['allAgentMarkets'],
    queryFn: () => getAgentMarkets({})
  });

  const allMarkets = allMarketsResponse?.data || [];
  const uniqueDistricts = useMemo(() => Array.from(new Set(allMarkets.map((m: any) => m.district))).filter(Boolean).sort(), [allMarkets]);
  const uniqueCommodities = useMemo(() => Array.from(new Set(allMarkets.flatMap((m: any) => m.products || []))).filter(Boolean).sort(), [allMarkets]);

  // Fetch filtered markets
  const { data: response, isLoading } = useQuery({
    queryKey: ['agentMarkets', searchString, selectedDistrict, selectedProduct],
    queryFn: () => getAgentMarkets({ searchString, district: selectedDistrict, product: selectedProduct })
  });

  const markets = response?.data || [];

  const handleSearch = () => {
    setSearchString(searchInput);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        {t('home', 'Home')} &rsaquo; <span className="text-slate-500 font-semibold">{t('nav_markets', 'Markets')}</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t('market_discovery', 'Market Discovery')}</h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('market_discovery_desc', 'Browse APMC markets across India. Find agents and live auctions.')}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <input
            type="text"
            placeholder={t('search_markets', 'Search markets...')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: '', label: t('all_districts', 'All Districts') },
              ...uniqueDistricts.map((d: any) => ({ value: d, label: d }))
            ]}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            options={[
              { value: '', label: t('all_commodities', 'All Commodities') },
              ...uniqueCommodities.map((c: any) => ({ value: c, label: c }))
            ]}
          />
        </div>
        <Button onClick={handleSearch} variant="primary" className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1.5 py-2">
          <span>🔍</span> {t('search', 'Search')}
        </Button>
      </div>

      <div className="text-xs text-slate-400 font-medium">
        {isLoading ? t('loading_markets', 'Loading markets...') : `${t('showing', 'Showing')} ${markets.length} ${t('markets_in_tn', 'markets in Tamil Nadu')}`}
      </div>

      {/* Main discovery area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Right Cards list */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full py-4">
                <AgriLoader message={t('loading_markets', 'Loading markets...')} />
              </div>
            ) : markets.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500 font-medium">{t('no_markets_found', 'No markets found.')}</div>
            ) : (
              markets.map((market: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{market.district}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">📍 {market.district}{t('tamil_nadu', ', Tamil Nadu')}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800`}>
                        {t('active', 'Active')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1 text-[11px] font-medium text-slate-600 border-t border-b border-slate-50">
                      <div>
                        <span className="text-slate-400">👤</span> {market.total_agents} {t('agents', 'Agents')}
                      </div>
                      <div>
                        <span className="text-slate-400">📦</span> {market.active_lots} {t('active_lots', 'Active Lots')}
                      </div>
                      <div className="col-span-1 text-slate-500 font-semibold truncate" title={market.products?.join(', ')}>
                        🌾 {market.products?.join(', ') || t('no_commodities', 'No Commodities')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onBrowseAgents(market.district)}
                    className={`w-full text-center py-2 rounded-md text-xs font-bold transition-all duration-200 bg-[#1b4d4f] hover:bg-[#13383a] text-white`}
                  >
                    {t('browse_agents', 'Browse Agents')}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-1 text-xs font-bold">
            <button className="w-8 h-8 rounded bg-[#1b4d4f] text-white flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">3</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">&rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
