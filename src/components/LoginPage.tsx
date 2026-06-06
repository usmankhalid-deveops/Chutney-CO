/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  Chrome,
  KeyRound,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, setView, showToast } = useApp();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please input all email and password fields');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Double check your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Oauth Google Login exception captured.', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper mock trigger for beginner to login instantly!
  const useQuickCredentials = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('usmankhalid619131ics@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('customer@test.com');
      setPassword('customer123');
    }
    showToast(`Loaded ${role} credentials! Click Verify below.`, 'info');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10 shadow-2xl shadow-slate-100 dark:shadow-slate-950 text-left"
      >
        <div className="space-y-2 text-center mb-8">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-950 dark:text-white tracking-tight">Welcome Back!</h2>
          <p className="text-xs text-slate-400">Lock down your favorite snacks under your profile account.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex gap-2 items-start mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer user-select-none">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
              Remember Me
            </label>
            <button 
              type="button"
              className="text-amber-500 hover:underline cursor-pointer"
              onClick={() => showToast('Enter your registered email and we will send a recovery link soon!', 'info')}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 border-none rounded-xl text-white font-bold text-sm transition font-sans cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-7 text-center">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100 dark:border-slate-800"></span></div>
          <span className="relative px-3 text-[10px] uppercase font-mono font-bold text-slate-400 bg-white dark:bg-slate-900">or utilize federated</span>
        </div>

        {/* Google Federated Authentication popup */}
        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-xs font-sans transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Chrome className="w-4 h-4 text-amber-500" />
          Continue with Google Auth
        </button>

        {/* Beginner Aid: Mock Credentials box */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-3">
          <h3 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">🎓 Beginner Mock Credentials</h3>
          <p className="text-[10px] text-slate-400">If you are in development and want to test roles without creating email/password in Firebase:</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => useQuickCredentials('customer')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 text-[10px] font-bold border-none cursor-pointer"
            >
              Test Customer
            </button>
            <button 
              onClick={() => useQuickCredentials('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/15 text-[10px] font-bold border-none cursor-pointer"
            >
              Test Master Admin
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an online profile?{' '}
            <button 
              onClick={() => setView('signup')}
              className="font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Register Here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
