import { useState, useEffect } from 'react';
import axios from 'axios';

interface LivePrice {
  name: string;
  price: string;
}

export const useLivePrices = () => {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const currentLang = localStorage.getItem('buyer_language') || 'en';
        const res = await axios.get(`http://localhost:6200/marketPrice/market-price-v2?lan=${currentLang}`);
        const data = res.data?.data || [];

        const extractedPrices: LivePrice[] = [];

        data.forEach((market: any) => {
          market.products?.forEach((product: any) => {
            product.varieties?.forEach((variety: any) => {
              if (variety.price) {
                const varietyName = variety.variety_name && variety.variety_name.trim() !== "" ? variety.variety_name : product.product_name;
                extractedPrices.push({
                  name: `${market.district} - ${varietyName}`,
                  price: `₹${variety.price}/${variety.unit || 'q'}`
                });
              }
            });
          });
        });

        // Group by district to distribute evenly
        const byDistrict: Record<string, LivePrice[]> = {};
        extractedPrices.forEach(item => {
          const district = item.name.split(' - ')[0];
          if (!byDistrict[district]) byDistrict[district] = [];
          if (!byDistrict[district].find(p => p.name === item.name)) {
            byDistrict[district].push(item);
          }
        });

        const finalPrices: LivePrice[] = [];
        let hasMore = true;
        let index = 0;

        while (hasMore && finalPrices.length < 20) {
          hasMore = false;
          for (const district in byDistrict) {
            if (byDistrict[district][index]) {
              finalPrices.push(byDistrict[district][index]);
              hasMore = true;
            }
            if (finalPrices.length >= 20) break;
          }
          index++;
        }

        setPrices(finalPrices);
      } catch (error) {
        console.error("Failed to fetch live prices", error);
        // Fallback data
        setPrices([
          { name: 'Paddy', price: '₹1,840/q' },
          { name: 'Onion', price: '₹2,200/q' },
          { name: 'Tomato', price: '₹1,100/q' },
          { name: 'Groundnut', price: '₹5,200/q' },
          { name: 'Cotton', price: '₹6,400/q' },
          { name: 'Wheat', price: '₹2,150/q' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { prices, loading };
};
