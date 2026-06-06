/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Truck, 
  CreditCard, 
  DollarSign,
  Briefcase,
  Gift
} from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, placeNewOrder, setView, profile } = useApp();
  
  const [recipientName, setRecipientName] = useState<string>(profile?.name || '');
  const [recipientEmail, setRecipientEmail] = useState<string>(profile?.email || '');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [loading, setLoading] = useState<boolean>(false);

  // Sync pre-fills once profile is loaded asynchronously
  React.useEffect(() => {
    if (profile) {
      setRecipientName(profile.name);
      setRecipientEmail(profile.email);
    }
  }, [profile]);

  const handleSetSelf = () => {
    if (profile) {
      setRecipientName(profile.name);
      setRecipientEmail(profile.email);
    }
  };

  const grandTotal = Math.round(cartTotal * 1.05);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !address || !recipientName || !recipientEmail) {
      alert('Please fill out all delivery recipient names, emails, and phone numbers.');
      return;
    }
    setLoading(true);
    try {
      await placeNewOrder({
        recipientName,
        recipientEmail,
        recipientPhone: phoneNumber,
        phone: phoneNumber,
        address: address,
        paymentMethod: paymentMethod
      });
    } catch (err) {
      console.error('Error placing checkout order', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb back */}
        <button 
          onClick={() => setView('cart')}
          className="mb-8 font-sans font-bold text-slate-500 dark:text-slate-400 hover:text-amber-500 text-xs flex items-center gap-2 cursor-pointer transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shopping Basket
        </button>

        <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-950 dark:text-white tracking-tight text-left mb-8">
          Secure Shipping Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Checkout shipping forms */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Delivery Information</h3>
              {profile && (
                <button
                  type="button"
                  onClick={handleSetSelf}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 transition rounded-lg font-bold cursor-pointer"
                  title="Click to autofill with your account details"
                >
                  Deliver to Myself
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmitOrder} className="space-y-6" id="checkout-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recipient Name</label>
                  <input 
                    type="text" 
                    value={recipientName} 
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    placeholder="e.g. Ali"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recipient Email Address</label>
                  <input 
                    type="email" 
                    value={recipientEmail} 
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                    placeholder="e.g. ali@example.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Delivery Street Address</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddress('Left Turn, Block 4, Karachi')}
                      className="px-2 py-0.5 text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition rounded-md font-bold cursor-pointer border border-amber-200 dark:border-amber-900"
                    >
                      📍 Karachi Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddress('Model Town, Khanpur District')}
                      className="px-2 py-0.5 text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition rounded-md font-bold cursor-pointer border border-amber-200 dark:border-amber-900"
                    >
                      📍 Khanpur Preset
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Left Turn, Block Four, Karachi OR Model Town, Khanpur District"
                    rows={3}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200 resize-none font-sans"
                  ></textarea>
                </div>
              </div>

              {/* Payment selector interface */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Payment Gateway</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer text-left ${paymentMethod === 'cash' ? 'bg-amber-500/5 border-amber-500 text-amber-600 dark:text-amber-400' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm">Cash on Delivery</h4>
                      <p className="text-[10px] text-slate-400">Pay inside Clifton region</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-amber-500" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer text-left ${paymentMethod === 'card' ? 'bg-amber-505/5 border-amber-500 text-amber-600 dark:text-amber-400' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm">Credit / Debit Card</h4>
                      <p className="text-[10px] text-slate-400">Secure gateway provider</p>
                    </div>
                    <CreditCard className="w-5 h-5 text-amber-500" />
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 border-none rounded-xl text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:shadow-amber-500/30"
              >
                <Truck className="w-5 h-5" />
                {loading ? 'Transmitting Order...' : `Confirm & Place Order (Rs. ${grandTotal})`}
              </button>
            </form>
          </div>

          {/* Cart selected items recap */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-5">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">Selected Basket Recap</h3>
              
              <div className="max-h-60 overflow-y-auto space-y-4 pb-2 scrollbar-thin pr-1.5">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 max-w-[200px] truncate">
                      {item.menuItem.name} <span className="font-mono text-xs font-bold text-slate-850 dark:text-slate-300">× {item.quantity}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-950 dark:text-amber-500">
                      Rs. {item.menuItem.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800/40 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-800 dark:text-slate-350">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Duty GST (5%)</span>
                  <span className="font-mono text-slate-800 dark:text-slate-350">Rs. {Math.round(cartTotal * 0.05)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping/Delivery</span>
                  <span className="text-green-500 font-semibold font-mono">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-dashed border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-slate-800 dark:text-slate-200">Total Sum</span>
                  <span className="font-sans text-lg text-amber-500">Rs. {grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Loyalty bonus box */}
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-550/20 flex gap-4">
              <Gift className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-200">Earned Clifton loyalty tokens!</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">By finishing this online meal order, your dashboard profile registers loyalty reward stars ready for cash conversions.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
