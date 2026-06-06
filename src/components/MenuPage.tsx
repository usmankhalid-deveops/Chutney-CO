/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory, MenuItem } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Flame, 
  Compass, 
  ShoppingBag,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MenuPage: React.FC = () => {
  const { menuItems, addToCart, loadingMenu } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');

  const categories: { key: FoodCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Items' },
    { key: 'chicken', label: 'BBQ Chicken' },
    { key: 'rolls', label: 'Paratha Rolls' },
    { key: 'burgers', label: 'Burgers' },
    { key: 'shawarma', label: 'Shawarma' },
    { key: 'bread', label: 'Tandoor Naan' }
  ];

  // Filtering Logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title and intro */}
        <div className="text-left space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full text-amber-500 font-bold text-[10px] uppercase font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Discover Clifton Flavors
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-slate-950 dark:text-white tracking-tight">
            Our Culinary Masterpieces
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Sizzling BBQ grills, hot paratha rolls, custom-baked tandoor naan, and classic street-style gourmet burgers prepared on order.
          </p>
        </div>

        {/* Controls: Search & Category filters */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5 mb-10 shadow-sm">
          {/* Search bar inputs */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Zinger, Paratha, Shami, or Naan..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
            />
          </div>

          {/* Categories select buttons */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4.5 py-2.5 rounded-xl font-semibold text-xs transition whitespace-nowrap cursor-pointer ${activeCategory === cat.key ? 'bg-amber-500 text-white shadow-md shadow-amber-500/15' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Items Listing with Animation */}
        {loadingMenu ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 font-mono">Baking flatbreads and reading grills...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 text-center max-w-lg mx-auto space-y-4">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Food Items Match Your Query</h3>
            <p className="text-xs text-slate-400">Try adjusting your filters or search terms. Double check spelling for "Zinger" or "Anda Shami".</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-850 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                      {/* Interactive Badge details */}
                      <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-amber-500 uppercase font-mono border border-slate-850">
                        {item.category}
                      </span>
                      
                      {item.stock <= 0 ? (
                        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
                            Temporarily Out of Stock
                          </span>
                        </div>
                      ) : item.stock <= 5 ? (
                        <span className="absolute bottom-4 left-4 bg-orange-500 text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.8 rounded-md flex items-center gap-1 shadow-md">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock ({item.stock})
                        </span>
                      ) : null}
                    </div>

                    {/* Metadata Content */}
                    <div className="p-6 pb-2 space-y-2">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </h3>
                        <p className="font-sans font-black text-amber-500 text-lg whitespace-nowrap">
                          Rs. {item.price}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Operational Footer action */}
                  <div className="p-6 pt-3 border-t border-slate-50 dark:border-slate-800/40 mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 font-mono">
                      Stock Level: {item.stock} pkts
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock <= 0 || !item.isAvailable}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border-none shadow-sm ${item.stock <= 0 ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10'}`}
                    >
                      <Plus className="w-4 h-4" />
                      Add to Basket
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
};
