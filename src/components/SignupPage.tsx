/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  CheckCircle,
  Briefcase,
  Users,
  Key
} from 'lucide-react';
import { motion } from 'motion/react';

export const SignupPage: React.FC = () => {
  const { signupWithEmail, setView, showToast } = useApp();
  
  const [fullname, setFullname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [adminId, setAdminId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !email || !password) {
      setErrorMsg('Please populate all registration forms');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length');
      return;
    }
    
    if (role === 'admin') {
      const VALID_ADMIN_IDS = ['ADMIN-USMAN', 'ADMIN2026', 'CHUTNEY-STAFF-99'];
      if (!adminId) {
        setErrorMsg('To request administrative staff rights, you must enter a valid authorized Admin ID.');
        return;
      }
      if (!VALID_ADMIN_IDS.includes(adminId.trim().toUpperCase())) {
        setErrorMsg('The Admin ID key you entered is unrecognized. Regular customers cannot obtain admin privileges.');
        return;
      }
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      await signupWithEmail(email, password, fullname, role, role === 'admin' ? adminId.toUpperCase() : undefined);
      showToast('Registration complete!', 'success');
      setView('home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. This email could be registered.');
    } finally {
      setLoading(false);
    }
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
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-950 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400">Join Clifton's premium online dining portal.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex gap-2 items-start mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Console Config notice for beginner */}
        <div className="p-3.5 mb-6 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
          <span className="font-bold">🎓 Beginner Note:</span> For email registration to succeed, ensure the 'Email/Password' trigger is enabled under your Firebase console.
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
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
                placeholder="Min. 6 keys"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Account Role Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Identify Profile Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setRole('customer')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs border cursor-pointer transition ${role === 'customer' ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'}`}
              >
                <Users className="w-4 h-4" />
                Customer
              </button>
              <button 
                type="button"
                onClick={() => {
                  setRole('admin');
                  showToast('The email usmankhalid619131ics@gmail.com is hard-coded as master admin. Register under it to secure instant admin privileges!', 'info');
                }}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs border cursor-pointer transition ${role === 'admin' ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'}`}
              >
                <Briefcase className="w-4 h-4" />
                Staff Admin
              </button>
            </div>
          </div>

          {role === 'admin' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1 origin-top"
            >
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Staff Admin Security ID</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. ADMIN-USMAN (Authorized Crew Only)"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200 uppercase font-sans font-semibold"
                />
              </div>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 border-none rounded-xl text-white font-bold text-sm transition font-sans cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
          >
            {loading ? 'Processing Registration...' : 'Register Profile Account'}
            <UserPlus className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an online profile?{' '}
            <button 
              onClick={() => setView('login')}
              className="font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Sign In Here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
