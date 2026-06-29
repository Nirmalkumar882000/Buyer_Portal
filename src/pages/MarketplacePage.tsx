import React, { useState, useEffect, useMemo } from 'react';
import { getMarketAndDirectSaleList, getMarkerSaleData } from '../api/markets';
import { getCart, addToCart, removeFromCart } from '../api/cart';
import { AgriLoader } from '../components/AgriLoader';
import { useNavigate } from 'react-router-dom';

interface MarketplacePageProps {
  onBackToDashboard: () => void;
  onSelectProduct: (lotId: string, agentId: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onBackToDashboard,
  onSelectProduct,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarketData();
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const res: any = await getCart();
      setCartCount(res?.cartCount || 0);
      setCartItems(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const res = await getMarkerSaleData({ page: 1, limit: 50 });
      
      const list = res?.data || [];
      const allItems = list.map((item: any) => {
          const emojiMap: any = {
            'banana': '🍌', 'mango': '🥭', 'pumpkin': '🎃', 'drumstick': '🥖', 'onion': '🧅', 'paddy': '🌾', 'groundnut': '🥜'
          };
          const emoji = emojiMap[item.product_name?.toLowerCase()] || '📦';
          
          let qtyStr = item.qty ? `${item.qty} ${item.unit}` : ``;
          if (item.status === 'UPCOMING' && item.auction_start_date) {
             const startDate = new Date(item.auction_start_date).toLocaleString(undefined, { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
             });
             qtyStr = qtyStr ? `${qtyStr} | Starts: ${startDate}` : `Starts: ${startDate}`;
          } else if (item.status === 'LIVE' && item.auction_end_date) {
             const endDate = new Date(item.auction_end_date).toLocaleString(undefined, { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
             });
             qtyStr = qtyStr ? `${qtyStr} | Ends: ${endDate}` : `Ends: ${endDate}`;
          } else if (qtyStr) {
             qtyStr = `${qtyStr} available`;
          } else {
             qtyStr = 'Available';
          }

          const sellerStr = `Agent: ${item.agent_details?.name || item.agent_details?.shop_name || 'Unknown'} | ${item.agent_details?.district || ''}`;
          const displayName = item.variety ? `${item.product_name} (${item.variety})` : item.product_name;

          return {
             productId: item.product_id,
             agentId: item.agent_details?.agent_id,
             lotId: item.lot_id,
             name: displayName,
             emoji,
             grade: 'Market Sale',
             gradeColor: 'bg-blue-50 text-blue-700 border-blue-100',
             seller: sellerStr,
             price: item.base_price ? `₹${item.base_price}` : 'Contact for price',
             qty: qtyStr,
             bg: 'bg-slate-50',
             status: item.status
          };
      });
      
      setProducts(allItems);
    } catch (e) {
       console.error("Error fetching market data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: any) => {
    if (!item.productId || !item.agentId) {
       alert("Product ID or Agent ID missing. Cannot add to cart.");
       return;
    }
    try {
      setAddingToCart(item.productId);
      await addToCart(item.productId, item.agentId, 1);
      fetchCartData();
      setIsCartOpen(true);
    } catch (e) {
      console.error("Failed to add to cart", e);
      alert("Failed to add to cart.");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleRemoveFromCart = async (cartId: number) => {
    try {
      await removeFromCart(cartId);
      fetchCartData();
    } catch (e) {
      console.error("Failed to remove from cart", e);
    }
  };

  const mappedCartItems = useMemo(() => {
    return cartItems.map(item => {
      const productInfo = products.find(p => p.productId === item.product_id && p.agentId === item.agent_id);
      
      const rawPrice = productInfo?.price || '0';
      const priceVal = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;
      
      return {
        id: String(item.id),
        product_id: item.product_id,
        agent_id: item.agent_id,
        name: productInfo?.name || `Product #${item.product_id}`,
        emoji: productInfo?.emoji || '📦',
        grade: productInfo?.grade || 'Standard',
        seller: productInfo?.seller || `Agent #${item.agent_id}`,
        pricePerKg: priceVal,
        priceString: productInfo?.price || 'Contact',
        qty: item.qty,
        bg: productInfo?.bg || 'bg-slate-50'
      };
    });
  }, [cartItems, products]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToDashboard} className="hover:text-slate-600 underline">Home</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Marketplace</span>
      </div>

      {/* Title & Cart Count */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fixed Price Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">Browse and buy agricultural produce at fixed prices</p>
        </div>
        {/* Cart feature temporarily disabled
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs"
        >
          <span>🛒</span> Cart ({cartCount})
        </button>
        */}
      </div>

      {/* Main filter + list section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side Filters Box */}
        {false && (
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-6 shrink-0 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Filters</span>
            <button className="text-[10px] text-slate-500 font-semibold border border-slate-200 px-2 py-0.5 rounded-sm hover:bg-slate-50">
              Clear All
            </button>
          </div>

          {/* Commodity Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Commodity</span>
            <div className="space-y-2 font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Paddy / Rice
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Wheat
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Groundnut
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Onion
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Tomato
              </label>
            </div>
          </div>

          {/* Price Range Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Price Range (₹/kg)</span>
            <div className="flex items-center gap-2 font-medium text-slate-500">
              <input type="number" defaultValue="10" className="w-16 px-2 py-1 bg-white border border-slate-350 rounded-sm text-center outline-hidden focus:border-[#1b4d4f]" />
              <span>to</span>
              <input type="number" defaultValue="200" className="w-16 px-2 py-1 bg-white border border-slate-350 rounded-sm text-center outline-hidden focus:border-[#1b4d4f]" />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Location</span>
            <select className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md outline-hidden transition focus:border-[#1b4d4f]">
              <option>Tamil Nadu</option>
              <option>Karnataka</option>
            </select>
          </div>

          {/* Seller Type Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Seller Type</span>
            <div className="space-y-2 font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Mandi Agent
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Farmer Direct
              </label>
            </div>
          </div>
        </div>
        )}

        {/* Right Side Grid */}
        <div className="flex-1 space-y-4 w-full">
          {/* Grid Top bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex gap-2 w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-hidden focus:border-[#1b4d4f]"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs text-slate-400 font-medium">
              <select className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md outline-hidden text-slate-700">
                <option>Sort: Newest</option>
                <option>Price: Low to High</option>
              </select>
              <span>Showing 24 products</span>
            </div>
          </div>

          {/* Commodity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center items-center">
                <AgriLoader message="Fetching fresh produce..." inline />
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                No products found.
              </div>
            ) : (
              products.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                  {/* Visual Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(item.lotId, item.agentId)}
                    className={`h-40 flex items-center justify-center text-5xl cursor-pointer hover:opacity-90 transition ${item.bg}`}
                  >
                    {item.emoji}
                  </div>
  
                  {/* Details */}
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.gradeColor}`}>
                        {item.grade}
                      </span>
                      <div className="cursor-pointer" onClick={() => onSelectProduct(item.lotId, item.agentId)}>
                        <h4 className="text-sm font-bold text-slate-800 hover:text-[#1b4d4f] transition line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.seller}</p>
                      </div>
                    </div>
  
                    <div className="flex justify-between items-baseline border-t border-slate-50 pt-2 text-xs font-bold">
                      <span className="text-[#1b4d4f] text-sm">{item.price}</span>
                      <span className="text-slate-400 text-[10px] font-semibold">{item.qty}</span>
                    </div>
  
                    <div className="grid grid-cols-1 gap-2 pt-1.5">
                      <button
                        onClick={() => onSelectProduct(item.lotId, item.agentId)}
                        disabled={item.status === 'UPCOMING'}
                        className={`w-full ${item.status === 'UPCOMING' ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#1b4d4f] hover:bg-[#123637] text-white'} text-[11px] font-bold py-2 rounded-md transition shadow-xs`}
                      >
                        {item.status === 'UPCOMING' ? 'Upcoming Sale' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-1 text-xs font-bold pt-4">
            <button className="w-8 h-8 rounded bg-[#1b4d4f] text-white flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">3</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">&rarr;</button>
          </div>
        </div>
      </div>

      {/* Cart Slide-out Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-4 bg-[#062920] flex justify-between items-center text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">🛒 Your Cart <span className="bg-emerald-500 text-[#062920] px-2 py-0.5 rounded-full text-xs">{cartCount}</span></h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-emerald-300 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-400 py-16 space-y-4">
                  <div className="text-6xl opacity-50">🛒</div>
                  <p className="font-semibold">Your cart is empty.</p>
                </div>
              ) : (
                mappedCartItems.map(item => {
                  return (
                    <div key={item.id} className="flex gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                      <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center text-3xl">
                        {item.emoji}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.name}</h4>
                          <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{item.seller}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-xs font-bold text-[#1b4d4f]">
                            {item.priceString} <span className="text-slate-400 text-[10px] font-medium">x {item.qty}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveFromCart(Number(item.id))}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white shadow-lg space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-800">
                  <span>Total Items</span>
                  <span>{cartCount}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout', { state: { cartItems: mappedCartItems } })}
                  className="w-full bg-[#062920] hover:bg-[#0b382d] text-white py-3.5 rounded-lg font-bold shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Checkout &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

