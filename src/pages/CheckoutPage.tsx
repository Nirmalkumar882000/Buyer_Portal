import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useLocation } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  emoji: string;
  grade: string;
  seller: string;
  pricePerKg: number;
  qty: number;
  bg: string;
}

interface CheckoutPageProps {
  onBackToMarketplace: () => void;
  onPlaceOrder: (orderSummary: {
    items: CartItem[];
    subtotal: number;
    paymentMethod: string;
    deliveryAddress: string;
  }) => void;
  initialCart?: CartItem[];
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToMarketplace,
  onPlaceOrder,
  initialCart,
}) => {
  const { showToast } = useToast();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>(
    location.state?.cartItems || initialCart || [
      {
        id: '1',
        name: 'Paddy (Ponni) – Grade A',
        emoji: '🌾',
        grade: 'Grade A',
        seller: 'Murugan Kandasamy | Thoothukudi',
        pricePerKg: 19.5,
        qty: 1000,
        bg: 'bg-emerald-50/70',
      },
      {
        id: '2',
        name: 'Groundnut (Bold) – Grade B',
        emoji: '🥜',
        grade: 'Grade B',
        seller: 'Rajan Farm | Thoothukudi',
        pricePerKg: 52.0,
        qty: 500,
        bg: 'bg-amber-50/40',
      },
    ]
  );

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'credit' | 'upi'>('wallet');
  const [deliveryAddress, setDeliveryAddress] = useState('2/58K, Shri Lakshmi Complex, Kayamozhi Road, Thoothukudi – 628213');

  const walletBalance = 18000;
  const creditLimit = 50000;

  const handleQtyChange = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(100, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.pricePerKg, 0);
  const isWalletInsufficient = paymentMethod === 'wallet' && subtotal > walletBalance;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }
    if (isWalletInsufficient) {
      showToast('Insufficient wallet balance. Please choose another payment method or top up.', 'error');
      return;
    }
    onPlaceOrder({
      items: cartItems,
      subtotal,
      paymentMethod,
      deliveryAddress,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToMarketplace} className="hover:text-slate-600 underline">Home</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Cart & Checkout</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Cart & Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">{cartItems.length} items in your cart</p>
      </div>

      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Cart Items) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Cart Items ({cartItems.length})</h2>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold border border-rose-100 bg-rose-50/55 hover:bg-rose-50 px-3.5 py-1.5 rounded-md transition flex items-center gap-1 shadow-2xs"
              >
                🗑 Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-3">
              <span className="text-4xl block">🛒</span>
              <p>Your cart is empty.</p>
              <button
                onClick={onBackToMarketplace}
                className="px-4 py-2 bg-[#1b4d4f] text-white rounded-md font-bold text-xs hover:bg-[#123637] transition"
              >
                Go to Marketplace
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Item metadata */}
                  <div className="flex gap-3 items-center">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-3xl border border-slate-100 shrink-0 ${item.bg}`}>
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{item.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.seller}</p>
                      <p className="text-xs font-extrabold text-[#1b4d4f] mt-1">₹{item.pricePerKg.toFixed(2)}/kg</p>
                    </div>
                  </div>

                  {/* Quantity and subtotal controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, -100)}
                        className="w-8 h-8 border border-slate-300 bg-slate-50 rounded-md text-sm font-bold text-slate-650 flex items-center justify-center hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-16 text-center text-xs font-bold text-slate-800">
                        {item.qty.toLocaleString()} kg
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, 100)}
                        className="w-8 h-8 border border-slate-300 bg-slate-50 rounded-md text-sm font-bold text-slate-650 flex items-center justify-center hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-800 w-20 text-right">
                        ₹{(item.qty * item.pricePerKg).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 text-sm font-bold p-1 rounded-sm hover:bg-rose-50 transition"
                        title="Remove item"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Order Summary & Payment) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">Order Summary</h2>

          <form onSubmit={handleOrderSubmit} className="space-y-5">
            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs font-semibold text-slate-650">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">
                    {item.name.split(' –')[0]} ({item.qty.toLocaleString()} kg)
                  </span>
                  <span>₹{(item.qty * item.pricePerKg).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium font-sans">Transport Charge</span>
                <span className="text-slate-400 italic">TBD</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Platform Fee</span>
                <span className="text-slate-500">₹0</span>
              </div>
              <div className="flex justify-between py-3 text-sm font-bold text-[#1b4d4f] border-t border-dashed border-slate-200">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">PAYMENT METHOD</span>
              <div className="space-y-2">
                {/* Wallet Option */}
                <label
                  onClick={() => setPaymentMethod('wallet')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition
                    ${paymentMethod === 'wallet'
                      ? isWalletInsufficient
                        ? 'border-rose-450 bg-rose-50/30'
                        : 'border-[#1b4d4f] bg-[#e2f2f1]/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wallet'}
                    readOnly
                    className={isWalletInsufficient ? 'text-rose-600 focus:ring-rose-500' : 'text-[#1b4d4f] focus:ring-[#1b4d4f]'}
                  />
                  <div className="text-xs font-semibold flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-800">Wallet</p>
                      {subtotal > walletBalance && (
                        <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                          Insufficient
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] font-bold mt-0.5 ${subtotal > walletBalance ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Available: ₹{walletBalance.toLocaleString()}
                    </p>
                  </div>
                </label>

                {/* Credit Limit */}
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
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Available: ₹{creditLimit.toLocaleString()}
                    </p>
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
                    <p className="text-slate-800">UPI / Razorpay</p>
                    <p className="text-[10px] text-slate-450 font-medium mt-0.5">Pay instantly via UPI</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address..."
                rows={2}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
                required
              />
            </div>

            {/* Place Order CTA */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={cartItems.length === 0 || isWalletInsufficient}
                className={`w-full py-3.5 rounded-md text-xs font-bold text-white transition shadow-xs flex items-center justify-center gap-2
                  ${cartItems.length === 0 || isWalletInsufficient
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-[#1b4d4f] hover:bg-[#123637]'
                  }`}
              >
                🛒 Place Order &mdash; ₹{subtotal.toLocaleString()}
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                By placing this order, you agree to the platform's terms of service
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
