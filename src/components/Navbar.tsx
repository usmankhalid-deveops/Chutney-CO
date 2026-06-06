/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  User, 
  ChefHat, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  X, 
  LogOut, 
  ShieldAlert,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    currentView, 
    setView, 
    cart, 
    profile, 
    logout 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  const handleNavClick = (view: any) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition duration-300 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
            id="nav-logo"
          >
            <div className="p-2 sm:p-2.5 bg-amber-500 rounded-2xl text-white group-hover:scale-105 transition duration-300 shadow-md shadow-amber-500/20">
              <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-amber-500">
                Chutney & Co.
              </h1>
              <p className="font-mono text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                Premium Grill & Street Food
              </p>
            </div>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`font-sans text-[15px] font-semibold transition cursor-pointer ${currentView === 'home' ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('menu')}
              className={`font-sans text-[15px] font-semibold transition cursor-pointer ${currentView === 'menu' ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'}`}
            >
              Menu
            </button>
            {profile && profile.role === 'customer' && (
              <button 
                onClick={() => handleNavClick('dashboard')}
                className={`font-sans text-[15px] font-semibold transition cursor-pointer ${currentView === 'dashboard' ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'}`}
              >
                Track Orders
              </button>
            )}
            {profile && profile.role === 'admin' && (
              <button 
                onClick={() => handleNavClick('admin-dashboard')}
                className={`flex items-center gap-1.5 font-sans text-[15px] font-bold text-red-500 dark:text-red-400 hover:brightness-110 cursor-pointer`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Interactive controls */}
          <div className="hidden md:flex items-center gap-5">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Theme"
              id="theme-toggler"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Shopping Cart button */}
            <button 
              onClick={() => handleNavClick('cart')}
              className="relative p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500 hover:scale-[1.03] transition duration-200 cursor-pointer"
              id="nav-cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Login actions */}
            {profile ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-100 dark:border-slate-800">
                <div 
                  onClick={() => handleNavClick(profile.role === 'admin' ? 'admin-dashboard' : 'dashboard')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 font-bold border border-slate-200 dark:border-slate-700">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      {profile.name}
                    </p>
                    <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider font-mono">
                      {profile.role}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 font-sans text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 transition cursor-pointer"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition shadow-md shadow-amber-500/15 hover:shadow-amber-500/30 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile controllers wrapper */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button 
              onClick={() => handleNavClick('cart')}
              className="relative p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500 cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => handleNavClick('home')}
              className={`w-full text-left py-2 font-sans text-sm font-semibold border-b border-slate-50 dark:border-slate-800 ${currentView === 'home' ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('menu')}
              className={`w-full text-left py-2 font-sans text-sm font-semibold border-b border-slate-50 dark:border-slate-800 ${currentView === 'menu' ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Menu
            </button>
            {profile && profile.role === 'customer' && (
              <button 
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left py-2 font-sans text-sm font-semibold border-b border-slate-50 dark:border-slate-800 ${currentView === 'dashboard' ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}
              >
                Track Orders
              </button>
            )}
            {profile && profile.role === 'admin' && (
              <button 
                onClick={() => handleNavClick('admin-dashboard')}
                className="w-full text-left py-2 font-sans text-sm font-bold text-red-500 border-b border-slate-50 dark:border-slate-800"
              >
                Admin Panel
              </button>
            )}

            {/* Profile or Login inside drawer */}
            {profile ? (
              <div className="pt-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.name}</p>
                    <p className="text-xs text-amber-500 uppercase tracking-wider font-mono font-bold">{profile.role}</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10 text-sm font-bold transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleNavClick('login')}
                  className="py-2.5 text-center font-sans text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNavClick('signup')}
                  className="py-2.5 text-center font-sans text-sm font-bold bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-md shadow-amber-500/15"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
