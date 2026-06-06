/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle,
  Sparkles,
  Key
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLoginPage: React.FC = () => {
  const { loginWithEmail, setView, showToast } = useApp();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [adminId, setAdminId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !adminId) {
      setErrorMsg('All administrative credentials including the Admin ID are required.');
      return;
    }

    const VALID_ADMIN_IDS = ['ADMIN-USMAN', 'ADMIN2026', 'CHUTNEY-STAFF-99'];
    if (!VALID_ADMIN_IDS.includes(adminId.trim().toUpperCase())) {
      setErrorMsg('Invalid Staff Admin ID. Access is strictly blocked for non-staff customers.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email, password);
      // Redirect handled by AppContext once profile loaded with 'admin' role
      showToast('Administrative authorization successful', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failure. Please consult with the restaurant IT lead.');
    } finally {
      setLoading(false);
    }
  };

  const loadMasterCredential = () => {
    setEmail('usmankhalid619131ics@gmail.com');
    setPassword('admin123');
    setAdminId('ADMIN-USMAN');
    showToast('Staff credentials and Admin ID pre-loaded. Click Verify below.', 'success');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-900/30 p-8 sm:p-10 shadow-2xl shadow-rose-100 dark:shadow-slate-950 text-left space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-500/20">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-950 dark:text-white tracking-tight">Staff Administration</h2>
          <p className="text-xs text-slate-400">Authorized restaurant and kitchen staff portal login.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex gap-2 items-start mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Informative help warning */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 leading-relaxed space-y-1.5">
          <p className="font-bold text-rose-500 font-mono uppercase tracking-wider">Security Notice</p>
          <p>This panel uses strict Firestore controls. Staff logins require a dual-layer credential system (Email, Password, plus authorized <strong>Admin ID Key</strong> e.g., <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-semibold text-slate-750 dark:text-slate-250">ADMIN-USMAN</code>) to prevent regular customer crossover.</p>
        </div>

        {/* Quick auto-load credentials trigger */}
        <button 
          onClick={loadMasterCredential}
          className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-450 border border-rose-500/20 hover:border-rose-500/30 font-extrabold text-[11px] font-mono rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Auto Load Master Staff Login
        </button>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Administrative Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@chutneyandco.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-rose-500 focus:outline-none dark:text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Staff Key Pass</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-rose-500 focus:outline-none dark:text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Staff Admin ID (Security Key)</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4.4 h-4.4 text-slate-400" />
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. ADMIN-USMAN"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-rose-500 focus:outline-none dark:text-slate-200 uppercase font-sans"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 border-none rounded-xl text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-600/30"
          >
            {loading ? 'Authenticating Privileges...' : 'Verify Staff Access'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setView('login')}
            className="text-xs text-slate-550 dark:text-slate-400 hover:text-amber-500 font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            ← Switch to Standard Customer Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};
