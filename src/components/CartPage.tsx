/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard,
  ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    cartTotal, 
    setView, 
    profile 
  } = useApp();

  const handleCheckoutClick = () => {
    if (!profile) {
      setView('login');
    } else {
      setView('checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-[85vh] py-16 px-4 transition flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10 space-y-5"
        >
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-sans font-black text-xl text-slate-900 dark:text-white">Your Shopping Basket is Empty</h3>
            <p className="text-xs text-slate-400">Choose from Clifton's finest chargrilled chest pieces, spicy paratha rolls, and crisp classic tandoor bread.</p>
          </div>
          <button 
            onClick={() => setView('menu')}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 border-none rounded-xl text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
          >
            Explore Food Menu
            <ArrowLeft className="w-4.5 h-4.5 rotate-180" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Action header */}
        <button 
          onClick={() => setView('menu')}
          className="mb-8 font-sans font-bold text-slate-500 dark:text-slate-400 hover:text-amber-500 text-xs flex items-center gap-2 cursor-pointer transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu Explorer
        </button>

        <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-950 dark:text-white tracking-tight text-left mb-8">
          Your Culinary Selection ({cart.length} items)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart items details list */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-left">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -30 }}
                  key={item.menuItem.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-50 dark:border-slate-800/45 last:border-b-0"
                >
                  {/* Item Image and Meta details */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.menuItem.imageUrl} 
                      alt={item.menuItem.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-850"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.menuItem.name}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-medium">{item.menuItem.category}</p>
                      <p className="text-xs font-semibold text-amber-500 font-mono mt-1">Rs. {item.menuItem.price} each</p>
                    </div>
                  </div>

                  {/* Quantity and delete controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-805 rounded-xl p-1">
                      <button 
                        onClick={() => updateCartQty(item.menuItem.id, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-amber-500 rounded-lg cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-sm font-black text-slate-850 dark:text-slate-200">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQty(item.menuItem.id, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-amber-500 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-mono text-sm font-bold text-slate-950 dark:text-slate-200 w-24 text-right">
                        Rs. {item.menuItem.price * item.quantity}
                      </p>
                      <button 
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pricing breakdown summary */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-left">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Order Billing Summary</h3>
            
            <div className="space-y-3.5 font-sans border-b border-slate-50 dark:border-slate-800/40 pb-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Delivery Charges</span>
                <span className="font-mono text-green-500 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tax GST (5%)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Rs. {Math.round(cartTotal * 0.05)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center font-sans">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Est. Total Amount</span>
              <span className="font-sans font-black text-amber-500 text-lg">Rs. {Math.round(cartTotal * 1.05)}</span>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 border-none rounded-2xl text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
            >
              <CreditCard className="w-4.5 h-4.5" />
              Proceed to Secure Checkout
            </button>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-start gap-2.5">
              <ChefHat className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-slate-400">Your food selection will be grilled from scratch upon successful order confirmation by Chutney & Co.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
