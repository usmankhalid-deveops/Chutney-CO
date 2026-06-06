/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  X, 
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Save,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    profile, 
    orders, 
    refreshCustomerOrders, 
    showToast,
    setView,
    setActiveOrder 
  } = useApp();

  const [editName, setEditName] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      refreshCustomerOrders();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    setUpdating(true);
    try {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: editName.trim()
      });
      showToast('Profile name updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user?.uid}`);
    } finally {
      setUpdating(false);
    }
  };

  // User order cancellation in Firestore
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action is irreversible.')) {
      return;
    }
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        updatedAt: new Date()
      });
      showToast('Order cancelled successfully.', 'info');
      refreshCustomerOrders();
    } catch (e: any) {
      showToast(`Cannot cancel order. ${e.message}`, 'error');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard layout headers */}
        <div className="text-left space-y-2 mb-10">
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
            Customer Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit your profile and review all previous and active meal order states.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User Profile Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-800/40 pb-5">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center font-black font-sans text-xl">
                {profile?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-[180px]">{profile?.name}</h3>
                <p className="text-xs text-slate-400">{profile?.email}</p>
                <span className="inline-block bg-amber-500/15 text-amber-500 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1">
                  Active {profile?.role}
                </span>
              </div>
            </div>

            {/* Editing Form */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-amber-500/10"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {updating ? 'Saving...' : 'Save Name'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-xl border-none text-xs font-bold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <p><span className="font-bold text-slate-700 dark:text-slate-350">Registered:</span> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-bold text-slate-700 dark:text-slate-350">UID Reference:</span> <code className="bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded text-[10px]">{profile?.uid.substring(0, 8)}...</code></p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs cursor-pointer transition"
                >
                  Edit Profile Name
                </button>
              </div>
            )}
          </div>

          {/* User Active & History Orders List */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/40 pb-4">
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Order History</h3>
                <button 
                  onClick={() => {
                    refreshCustomerOrders();
                    showToast('History list updated.', 'success');
                  }}
                  className="p-1 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-500 cursor-pointer flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Sync List
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                  <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">No Orders Logged Yet</h4>
                  <p className="text-xs text-slate-400">Whenever you confirm culinary selects from the checkout sheet, order statuses display right here.</p>
                  <button 
                    onClick={() => setView('menu')}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl border-none text-xs cursor-pointer shadow-md"
                  >
                    Start Ordering Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div 
                      key={o.id}
                      className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-4"
                    >
                      {/* Header block with statuses */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                        <div>
                          <p className="text-xs font-mono font-bold text-slate-400">Order Reference: #{o.id.substring(0, 10)}...</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Placed on {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Status elements */}
                        <div className="flex items-center gap-2">
                          {o.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold font-mono text-[9px] uppercase tracking-wider animate-pulse">
                              <Clock className="w-3 h-3" />
                              Pending BBQ Grill
                            </span>
                          )}
                          {o.status === 'delivered' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                              <CheckCircle className="w-3 h-3" />
                              Delivered & Dining
                            </span>
                          )}
                          {o.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                              <AlertCircle className="w-3 h-3" />
                              Cancelled
                            </span>
                          )}
                          
                          {/* Cancellation Button */}
                          {o.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelOrder(o.id)}
                              className="p-1 px-2.5 rounded-lg border border-red-200 hover:border-red-500 text-red-605 bg-red-500/5 hover:bg-red-550/10 text-[10px] font-bold text-red-500 transition cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Item summaries list */}
                      <div className="text-xs text-slate-500 dark:text-slate-450 space-y-1.5">
                        <p className="font-bold text-slate-700 dark:text-slate-300">Selected Platters:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex gap-1">
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-slate-650 dark:text-slate-350">{it.name}</span>
                              <span className="font-mono text-xs text-slate-400">({it.quantity} pkt)</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subtotal summary footer and print link */}
                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                        <div className="text-xs">
                          <span className="text-slate-400">Total Charged: </span>
                          <span className="font-sans font-bold text-slate-800 dark:text-slate-205">Rs. {o.totalAmount}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveOrder(o);
                            setView('receipt');
                          }}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg border-none text-[10px] font-bold cursor-pointer transition shadow-sm"
                        >
                          View Invoice Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
