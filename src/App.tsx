/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ReceiptPage } from './components/ReceiptPage';
import { DashboardPage } from './components/DashboardPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Core view Router switch
const AppContent: React.FC = () => {
  const { currentView, toasts, removeToast } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'receipt':
        return <ReceiptPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      
      {/* Dynamic Navigations */}
      <Navbar />

      {/* Primary SPA View Canvas with Motion and Fade shifts */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating System-wide Toast Notification alerts overlays */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 font-sans w-full max-w-[340px] px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              key={t.id}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border text-left shadow-xl shadow-slate-200/50 dark:shadow-slate-950 flex items-start gap-3 pointer-events-auto ${
                t.type === 'success' ? 'border-green-150 border-green-500/20' :
                t.type === 'error' ? 'border-red-150 border-red-500/20' :
                t.type === 'warning' ? 'border-amber-150 border-amber-500/20' :
                'border-slate-150 border-slate-500/20'
              }`}
            >
              {/* Type responsive icon overlays */}
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
              {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-amber-500 shrink-0" />}

              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-semibold text-slate-850 dark:text-slate-200">{t.message}</p>
              </div>

              {/* Dismiss manual keys */}
              <button 
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
