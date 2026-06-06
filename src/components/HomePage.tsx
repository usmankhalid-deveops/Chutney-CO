/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { getLocalImageForDish } from '../data';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Award, 
  ThumbsUp, 
  Flame, 
  UtensilsCrossed 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setView } = useApp();

  const reviews = [
    {
      name: 'Muhammad Ali',
      role: 'Local Foodie',
      comment: "The Zinger Paratha Roll here is legendary! Crisp chicken, flaky buttery paratha, and that signature local hot sauce... absolutely outstanding.",
      stars: 5,
      date: 'Yesterday'
    },
    {
      name: 'Ayesha Khan',
      role: 'Corporate Manager',
      comment: 'Their Anda Shami Burger brings back direct Karachi street food memories. Prompt checkout, tidy container presentation, and perfectly prepared. Recommended!',
      stars: 5,
      date: '3 days ago'
    },
    {
      name: 'Bilal Siddiqui',
      role: 'Regular Guest',
      comment: 'Chest piece is succulent and loaded with traditional BBQ smoky flavor. Cooked to fresh perfection and never dry. Excellent service.',
      stars: 5,
      date: '1 week ago'
    }
  ];

  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* 1. Hero Banner Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-tr from-slate-900 to-slate-950 text-white py-16 sm:py-24">
        {/* Abstract background graphics with no clutter */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15),transparent)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-semibold font-mono text-xs uppercase"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                The Authentic BBQ Taste
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight"
              >
                Craving Traditional <span className="text-amber-500">Grills & Crispy</span> Paratha Rolls?
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-sans text-slate-300 text-lg sm:text-xl max-w-xl font-light leading-relaxed"
              >
                Indulge in charcoal-grilled Chest Pieces, legendary Pakistani Anda Shami, crispy Zinger burgers, and fresh, clay-oven sesame Naans. Freshly cooked, hot, and packed with original signature chutneys.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <button 
                  onClick={() => setView('menu')}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center gap-2 cursor-pointer text-base"
                >
                  Explore Full Menu
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('about-intro');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-900/50 text-slate-300 hover:text-amber-500 font-bold rounded-2xl transition cursor-pointer text-base"
                >
                  Our Story
                </button>
              </motion.div>
            </div>

            {/* Premium visual mockup using a direct food graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500/30 to-red-500/30 blur-3xl opacity-60"></div>
                <img 
                  src={getLocalImageForDish('Chest Piece')} 
                  alt="BBQ Chicken Platter" 
                  className="rounded-3xl shadow-2xl relative z-10 w-full max-w-[420px] aspect-square object-cover border border-slate-800"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Brand Introduction */}
      <section id="about-intro" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h3 className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">
              Hand-Selected Sourced Ingredients
            </h3>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
              Purity & Passion in Everyday Cooking
            </h2>
            <p className="font-sans text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Serving the absolute premium benchmark of Karachi street eats and live BBQ grills. Every single paratha is rolled fresh by hand using organic wheat flour. Our meats are sourced fresh daily and marinated in traditional stone-ground house herbs for over 24 hours. No artificial colors. Genuine local love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Active Charcoal BBQ</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Authentic wood-smoked roasting gives our chest and leg pieces that deep, irreplaceable grill finish.</p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white">100% Handcrafted Rolls</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Flaky golden lachha parathas fried till perfect golden crispness and rolled to wrap spicy tikka chunks.</p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Highest Standards</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Premium food-grade packaging safeguards hot temperatures and crisp textures during prompt delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Bestsellers (Bento-Styling) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div className="text-left space-y-2">
              <h3 className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">Crowd Favorites</h3>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white">Best Selling Items</h2>
            </div>
            <button 
              onClick={() => setView('menu')}
              className="px-5 py-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-white text-slate-800 dark:text-amber-500 font-bold transition flex items-center gap-1.5 cursor-pointer text-sm"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Best Seller 1 */}
            <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-850 hover:shadow-xl transition duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={getLocalImageForDish('Zinger Paratha Roll')} 
                  alt="Zinger Paratha Roll"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-red-500 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md shadow-md shadow-red-500/15">
                  Top Seller
                </span>
              </div>
              <div className="p-6 text-left space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Zinger Paratha Roll</h4>
                  <p className="font-sans font-extrabold text-amber-500">Rs. 280</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Crispy breast fillet strip, freshly prepared mayonnaise, and local spices tightly rolled in flaky hot wheat paratha.</p>
              </div>
            </div>

            {/* Best Seller 2 */}
            <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-850 hover:shadow-xl transition duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={getLocalImageForDish('Anda Shami Burger')} 
                  alt="Anda Shami Burger"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-orange-500 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md shadow-md shadow-orange-500/15">
                  Local Icon
                </span>
              </div>
              <div className="p-6 text-left space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Anda Shami Burger</h4>
                  <p className="font-sans font-extrabold text-amber-500">Rs. 150</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Pan-fried savory lentil kebab topped with egg coating, customized local red chutneys, sliced cucumbers inside a toasted bun.</p>
              </div>
            </div>

            {/* Best Seller 3 */}
            <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-850 hover:shadow-xl transition duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={getLocalImageForDish('Kitchen Chest Piece')} 
                  alt="Kitchen Chest Piece BBQ"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-amber-500 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md shadow-md shadow-amber-500/15">
                  Charcoal Signature
                </span>
              </div>
              <div className="p-6 text-left space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Kitchen Chest Piece</h4>
                  <p className="font-sans font-extrabold text-amber-500">Rs. 380</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-405 line-clamp-2">Smoked barbecued whole chest chunk spiced in red pepper flakes, served dry with green chili coriander garnishing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Reviews */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h3 className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">
              Reviews & Testimonials
            </h3>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
              Loved by Foodies Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div 
                key={index}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-6 text-left hover:-translate-y-1 transition duration-300"
              >
                <p className="font-sans italic text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold font-sans text-sm">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">{rev.name}</h5>
                    <p className="text-xs text-slate-400">{rev.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-xs text-slate-700 dark:text-slate-200">{rev.stars}.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact & Location Information */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="space-y-3">
                <h3 className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">Find Us Locally</h3>
                <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white">Contact & Quick Support</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">Have an inquiry regarding bulk event catering, home deliveries, or special orders? Reach out right away.</p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Karachi Flagship Unit</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Left Turn, Block 4, Clifton Food Avenue, Karachi, Pakistan</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Khanpur Regional Unit</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Model Town, Khanpur District, Pakistan</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Hotline Support</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">+92 (300) 123-4567, +92 (312) 765-4321</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Email Address</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">order@chutneyandco.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Styled Local Timing Board */}
              <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 text-left space-y-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-500" />
                  <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Opening & Dining Hours</h3>
                </div>
                <p className="text-xs text-slate-400 font-mono">We bake, roast, and grill live every single day. Stop by or request online delivery!</p>
                
                <div className="space-y-3.5 pt-2">
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Monday - Thursday</span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-amber-500">3:00 PM - 1:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Friday</span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-amber-500">4:00 PM - 2:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Saturday - Sunday</span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-amber-500">2:00 PM - 3:00 AM</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 text-xs text-amber-800 dark:text-amber-400">
                  <span className="font-bold">Live Cooking Note:</span> Our clay tandoor oven closes strictly 30 minutes prior to dining closure. Ensure takeout orders are secured before midnight!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Main Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500 rounded-xl text-white">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="font-sans font-black text-base tracking-tight">Chutney & Co.</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">The premium gold standard of traditional charcoal barbecues, live clay-oven baking, and crisp wheat paratha wraps in Karachi, Clifton.</p>
            </div>
            
            <div className="space-y-3 text-left">
              <h4 className="font-bold text-sm text-slate-100 font-sans tracking-wide">Menu Segments</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('menu')}>Chargrilled BBQ Chicken</li>
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('menu')}>Crisp Flour Paratha Rolls</li>
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('menu')}>Toasted Gourmet Burgers</li>
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('menu')}>Clay Oven Hot Breads</li>
              </ul>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="font-bold text-sm text-slate-100 font-sans tracking-wide">Customer Support</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('dashboard')}>Online Order Tracking</li>
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('login')}>User Authentication</li>
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('signup')}>New Account Signup</li>
                <li className="hover:text-amber-500 transition cursor-pointer" onClick={() => setView('cart')}>Shopping Checkout</li>
              </ul>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="font-bold text-sm text-slate-100 font-sans tracking-wide">Security Invariant</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Transactions are handled real-time on our secure, encrypted Firebase architecture. All order status transitions are strictly server-locked.</p>
              <p className="text-[10px] text-amber-500 font-mono font-semibold uppercase tracking-wider">Secure Firestore Cloud System</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2026 Chutney & Co. Ltd. Clifton Division. All Rights Reserved.</p>
            <p className="hover:text-white transition cursor-pointer mt-3 sm:mt-0" onClick={() => setView('admin-login')}>Administrative portal (Authorized Staff Only)</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
