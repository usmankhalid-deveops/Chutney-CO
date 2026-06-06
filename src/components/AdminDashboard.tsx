/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MenuItem, Order, FoodCategory } from '../types';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { menuItems, refreshMenu, showToast, isReady, profile, setView } = useApp();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu'>('analytics');
  
  // Real-time fetched states for orders & customers
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  
  // New food item form states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<FoodCategory>('chicken');
  const [newItemPrice, setNewItemPrice] = useState<number>(100);
  const [newItemStock, setNewItemStock] = useState<number>(30);
  const [newItemDesc, setNewItemDesc] = useState<string>('');
  const [newItemImage, setNewItemImage] = useState<string>('');
  
  // Editing individual item form states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Sync / retrieve all orders
  const refreshAdminOrders = async () => {
    setLoadingOrders(true);
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    
    // Date normalization helper
    const getMillis = (dateObj: any): number => {
      if (!dateObj) return 0;
      if (typeof dateObj === 'string') return new Date(dateObj).getTime();
      if (dateObj instanceof Date) return dateObj.getTime();
      if (typeof dateObj.getTime === 'function') return dateObj.getTime();
      if (typeof dateObj.toDate === 'function') return dateObj.toDate().getTime();
      if (dateObj.seconds !== undefined) return dateObj.seconds * 1000 + (dateObj.nanoseconds || 0) / 1000000;
      return 0;
    };

    if (isLocalMock) {
      const storedOrders = localStorage.getItem('rms_local_orders');
      const list: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
      list.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setAllOrders(list);
      setLoadingOrders(false);
      return;
    }
    try {
      const qSnapshot = await getDocs(collection(db, 'orders'));
      const list: Order[] = [];
      qSnapshot.forEach((doc) => {
        list.push(doc.data() as Order);
      });
      // Sort newest order first
      list.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setAllOrders(list);
    } catch (e: any) {
      console.warn('Admin view orders offline sync.', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isReady && (!profile || profile.role !== 'admin')) {
      showToast('Unauthorized entry blocked. Admins only.', 'error');
      setView('home');
      return;
    }
    refreshAdminOrders();
  }, [isReady]);

  // Order status updating
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: 'delivered' | 'cancelled') => {
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    if (isLocalMock) {
      const storedOrders = localStorage.getItem('rms_local_orders');
      let list: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
      list = list.map((o) => o.id === orderId ? { ...o, status: nextStatus, updatedAt: new Date() } : o);
      localStorage.setItem('rms_local_orders', JSON.stringify(list));
      showToast(`Order status set to ${nextStatus}`, 'success');
      refreshAdminOrders();
      return;
    }
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status: nextStatus,
        updatedAt: new Date()
      });
      showToast(`Order status set to ${nextStatus}`, 'success');
      refreshAdminOrders();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Menu Creation action in Firestore
  const handleAddFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemDesc.trim()) {
      showToast('Please insert valid item name and description.', 'error');
      return;
    }
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    const defaultImg = newItemImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';
    
    const newFood: MenuItem = {
      id: isLocalMock ? `mock-menu-${Date.now()}` : '', // will set below for Firestore
      name: newItemName.trim(),
      category: newItemCategory,
      price: Number(newItemPrice),
      stock: Number(newItemStock),
      description: newItemDesc.trim(),
      imageUrl: defaultImg,
      isAvailable: newItemStock > 0
    };

    if (isLocalMock) {
      const storedMenu = localStorage.getItem('rms_local_menu');
      const list: MenuItem[] = storedMenu ? JSON.parse(storedMenu) : [...menuItems];
      list.push(newFood);
      localStorage.setItem('rms_local_menu', JSON.stringify(list));
      showToast(`${newFood.name} added to live menu! (Offline Mode)`, 'success');
      setShowAddForm(false);
      setNewItemName('');
      setNewItemDesc('');
      setNewItemImage('');
      setNewItemPrice(100);
      setNewItemStock(30);
      refreshMenu();
      return;
    }

    try {
      const menuCollRef = collection(db, 'menu');
      const docRef = doc(menuCollRef);
      newFood.id = docRef.id;

      await setDoc(docRef, newFood);
      showToast(`${newFood.name} added to live menu!`, 'success');
      setShowAddForm(false);
      
      // Reset forms
      setNewItemName('');
      setNewItemDesc('');
      setNewItemImage('');
      setNewItemPrice(100);
      setNewItemStock(30);

      refreshMenu();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'menu');
    }
  };

  // Menu item deletions in Firestore
  const handleDeleteFoodItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) {
      return;
    }
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    if (isLocalMock) {
      const storedMenu = localStorage.getItem('rms_local_menu');
      let list: MenuItem[] = storedMenu ? JSON.parse(storedMenu) : [...menuItems];
      list = list.filter((item) => item.id !== itemId);
      localStorage.setItem('rms_local_menu', JSON.stringify(list));
      showToast('Item deleted successfully (Offline Mode)', 'info');
      refreshMenu();
      return;
    }
    try {
      await deleteDoc(doc(db, 'menu', itemId));
      showToast('Item deleted successfully', 'info');
      refreshMenu();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `menu/${itemId}`);
    }
  };

  const handleStartEditing = (item: MenuItem) => {
    setEditingItem(item);
  };

  // Menu item details update in Firestore
  const handleUpdateItemDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    if (isLocalMock) {
      const storedMenu = localStorage.getItem('rms_local_menu');
      let list: MenuItem[] = storedMenu ? JSON.parse(storedMenu) : [...menuItems];
      list = list.map((item) => 
        item.id === editingItem.id ? { 
          ...item, 
          name: editingItem.name,
          price: Number(editingItem.price),
          stock: Number(editingItem.stock),
          description: editingItem.description,
          isAvailable: editingItem.stock > 0
        } : item
      );
      localStorage.setItem('rms_local_menu', JSON.stringify(list));
      showToast('Item properties saved successfully (Offline Mode)', 'success');
      setEditingItem(null);
      refreshMenu();
      return;
    }
    try {
      const docRef = doc(db, 'menu', editingItem.id);
      await updateDoc(docRef, {
        name: editingItem.name,
        price: Number(editingItem.price),
        stock: Number(editingItem.stock),
        description: editingItem.description,
        isAvailable: editingItem.stock > 0
      });
      showToast('Item properties saved successfully', 'success');
      setEditingItem(null);
      refreshMenu();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `menu/${editingItem.id}`);
    }
  };

  // Instant quick stock changer buttons for admin
  const handleModifyStockValue = async (item: MenuItem, change: number) => {
    const nextStock = Math.max(0, item.stock + change);
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    if (isLocalMock) {
      const storedMenu = localStorage.getItem('rms_local_menu');
      let list: MenuItem[] = storedMenu ? JSON.parse(storedMenu) : [...menuItems];
      list = list.map((it) => 
        it.id === item.id ? { ...it, stock: nextStock, isAvailable: nextStock > 0 } : it
      );
      localStorage.setItem('rms_local_menu', JSON.stringify(list));
      refreshMenu();
      return;
    }
    try {
      const docRef = doc(db, 'menu', item.id);
      await updateDoc(docRef, {
        stock: nextStock,
        isAvailable: nextStock > 0
      });
      refreshMenu();
    } catch (err) {
      console.warn('Error changing stock locally:', err);
    }
  };

  // Computation for Analytics Dashboard
  const totalOrdersCount = allOrders.length;
  const totalRevenueSum = allOrders
    .filter((o) => o.status === 'delivered')
    .reduce((acc, current) => acc + current.totalAmount, 0);

  const pendingOrdersCount = allOrders.filter((o) => o.status === 'pending').length;

  // Track unique customers
  const uniqueCustomerSet = new Set(allOrders.map((o) => o.userId));
  const totalCustomersCount = uniqueCustomerSet.size || 0;

  // Identify low stock items (threshold is <= 5 packets)
  const lowStockItems = menuItems.filter((it) => it.stock <= 5);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Printable Shift Sheet (Only visible during physical print / PDF export) */}
        <div className="hidden print:block text-slate-900 bg-white p-10 font-sans space-y-8 text-left" id="shift-print-canvas">
          <div className="text-center border-b border-dashed border-slate-300 pb-6 space-y-1">
            <h1 className="font-sans font-black text-3xl tracking-tight uppercase text-amber-600">Chutney & Co.</h1>
            <p className="text-xs font-mono tracking-wider uppercase font-extrabold text-slate-500">Official Store Shift Statement</p>
            <p className="text-[11px] text-slate-400 font-mono">Timestamp: {new Date().toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Shift Manager</span>
              <p className="font-bold text-slate-800">{profile?.name || 'Authorized Administrator'}</p>
              <p className="font-mono text-slate-500">{profile?.email || 'admin@chutneyandco.com'}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Establishment Unit</span>
              <p className="font-bold text-slate-800">Branch 01 - Clifton, Karachi</p>
              <p className="text-slate-500 font-mono text-[10px] font-bold">Role: {profile?.role?.toUpperCase() || 'ADMIN'}</p>
            </div>
          </div>

          {/* Core financial matrices */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest font-mono text-slate-400 border-b pb-2">Shift Financial Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                <span className="text-[10px] uppercase font-mono text-slate-440 block">Fulfilled Revenue</span>
                <span className="font-sans font-black text-lg text-emerald-600 font-bold">Rs. {totalRevenueSum}</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                <span className="text-[10px] uppercase font-mono text-slate-440 block">Dispatched Orders</span>
                <span className="font-sans font-black text-lg text-amber-600 font-bold">{allOrders.filter(o => o.status === 'delivered').length} / {totalOrdersCount}</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                <span className="text-[10px] uppercase font-mono text-slate-440 block">Unique Customers</span>
                <span className="font-sans font-black text-lg text-indigo-600 font-bold">{totalCustomersCount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Forecast summaries */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-widest font-mono text-slate-400 border-b pb-2">Sales Forecast Estimates</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Daily BBQ Forecast (15%)</span>
                  <span className="font-bold font-mono">Rs. {Math.round(totalRevenueSum * 0.15)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Weekly BBQ Forecast (65%)</span>
                  <span className="font-bold font-mono">Rs. {Math.round(totalRevenueSum * 0.65)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-800 font-sans">Monthly Revenue Estimate</span>
                  <span className="font-black font-sans text-amber-500">Rs. {totalRevenueSum}</span>
                </div>
              </div>
            </div>

            {/* Critical low inventory warnings */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-widest font-mono text-slate-400 border-b pb-2">Urgent Inventory Alerts</h3>
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">All stock metrics are fully healthy and plentiful.</p>
              ) : (
                <div className="space-y-1 text-xs">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-1 border-b border-dashed border-slate-100">
                      <span className="text-slate-700 font-semibold">• {item.name}</span>
                      <span className="font-mono px-1.5 py-0.5 bg-rose-50 text-rose-600 font-extrabold rounded">
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menu catalog summary inside printed report */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest font-mono text-slate-400 border-b pb-2">Menu Segment & Stock Registry</h3>
            <table className="w-full text-[11px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="pb-2 font-semibold">Dish Platter Item</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold text-right">Price Value</th>
                  <th className="pb-2 font-semibold text-center">Remaining Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 font-bold text-slate-805">{item.name}</td>
                    <td className="py-2 text-slate-500 uppercase font-mono">{item.category}</td>
                    <td className="py-2 text-right font-mono font-bold">Rs. {item.price}</td>
                    <td className="py-2 text-center font-mono font-extrabold">
                      <span className={item.stock <= 5 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {item.stock} pkts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-8 text-center text-[10px] text-slate-400 font-mono uppercase font-semibold">
            *** End of System Generated Shift Report & Logs ***
          </div>
        </div>

        {/* Regular Interactive Admin UI (hidden when printing) */}
        <div className="print:hidden">
          {/* Core title structure */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-rose-500" />
                Administrative Workspace
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review analytics, fulfill orders, and configure dishes and inventory.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  refreshAdminOrders();
                  refreshMenu();
                  showToast('Refreshed workspace analytics', 'success');
                }}
                className="p-2 px-4 rounded-xl border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-500 dark:text-slate-450 hover:text-slate-800 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sync Dashboard Data
              </button>

              <button 
                onClick={() => {
                  window.print();
                }}
                className="p-2 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-805 hover:dark:bg-slate-700 text-white border-none text-xs font-bold cursor-pointer flex items-center gap-1.5 transition whitespace-nowrap shadow-md text-center"
              >
                <Printer className="w-3.5 h-3.5" strokeWidth={2.5} />
                Print Clean Shift
              </button>
            </div>
          </div>
        </div>

        <div className="print:hidden">

        {/* Tab Selector controls */}
        <div className="border-b border-slate-100 dark:border-slate-800 flex gap-6 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 font-sans font-extrabold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${activeTab === 'analytics' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Analytics & Reports
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-sans font-extrabold text-sm border-b-2 transition relative whitespace-nowrap cursor-pointer ${activeTab === 'orders' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Live Kitchen Orders
            {pendingOrdersCount > 0 && (
              <span className="ml-1.5 px-2 py-0.2 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 font-sans font-extrabold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${activeTab === 'menu' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Menu & Inventory Control
          </button>
        </div>

        {/* Active Tab Contents */}
        <AnimatePresence mode="wait">
          {/* 1. Analytics & Reports Layout */}
          {activeTab === 'analytics' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="analytics"
              className="space-y-8"
            >
              {/* Analytics grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Fulfilled Revenue</p>
                    <h3 className="font-sans font-black text-2xl text-slate-950 dark:text-white">Rs. {totalRevenueSum}</h3>
                  </div>
                  <div className="w-11 h-11 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Total Orders */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-medium">Total Food Orders</p>
                    <h3 className="font-sans font-black text-2xl text-slate-950 dark:text-white">{totalOrdersCount}</h3>
                  </div>
                  <div className="w-11 h-11 bg-amber-505/10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                {/* Total Customers */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Unique Customers</p>
                    <h3 className="font-sans font-black text-2xl text-slate-950 dark:text-white">{totalCustomersCount}</h3>
                  </div>
                  <div className="w-11 h-11 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* Low Stock Alerts Count */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Low Stock Alerts</p>
                    <h3 className="font-sans font-black text-2xl text-rose-500">{lowStockItems.length}</h3>
                  </div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${lowStockItems.length > 0 ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Middle Section: Low Stock and sales reports overview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visual Low inventory alarms list */}
                <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-slate-800/40">
                    <h4 className="font-bold text-slate-850 dark:text-white text-sm uppercase tracking-wider font-mono">Low Inventory Warnings</h4>
                    <span className="text-xs text-red-505 bg-rose-500/10 text-rose-600 px-2.5 py-1 rounded-xl font-bold font-mono">Alert Threshold (≤5 pkt)</span>
                  </div>

                  {lowStockItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                      All menu item stocks are healthy and plentiful!
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/40 max-h-60 overflow-y-auto">
                      {lowStockItems.map((it) => (
                        <div key={it.id} className="flex justify-between items-center py-3 text-xs">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-950 dark:text-white">{it.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-mono">{it.category}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 font-mono font-bold rounded">
                              Only {it.stock} items left
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sales breakdown report statistics */}
                <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5">
                  <h4 className="font-bold text-slate-850 dark:text-white text-sm uppercase tracking-wider font-mono border-b border-slate-50 dark:border-slate-800/40 pb-3">Structured Sales Analytics</h4>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">Daily BBQ Sales (Est.)</span>
                      <span className="font-mono text-slate-850 dark:text-slate-205 font-bold">Rs. {Math.round(totalRevenueSum * 0.15)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">Weekly BBQ Sales (Est.)</span>
                      <span className="font-mono text-slate-850 dark:text-slate-205 font-bold">Rs. {Math.round(totalRevenueSum * 0.65)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">Monthly BBQ Sales (Est.)</span>
                      <span className="font-mono text-slate-850 dark:text-slate-205 font-bold text-base font-extrabold text-amber-500">Rs. {totalRevenueSum}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-450 leading-relaxed font-semibold">
                    <span className="font-bold text-amber-500">Notice on Payments:</span> Revenue estimates are sync aggregated in cloud Firestore based strictly on checked orders tagged with the successful <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[9px] font-sans">delivered</code> status.
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 2. Live Kitchen Orders Layout */}
          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="orders"
              className="space-y-6"
            >
              {loadingOrders ? (
                <div className="flex flex-col items-center py-16 gap-2">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-450 font-mono">Checking kitchen logs...</p>
                </div>
              ) : allOrders.length === 0 ? (
                <div className="p-14 bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-350 mx-auto" />
                  <p className="text-sm text-slate-500">The restaurant has registered zero orders so far today.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allOrders.map((o) => (
                    <div 
                      key={o.id} 
                      className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden"
                    >
                      {/* Active tag border */}
                      {o.status === 'pending' && <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 animate-pulse"></div>}
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50 dark:border-slate-800/40">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Customer: {o.customerName}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{o.customerEmail}</p>
                            <p className="text-[10px] text-slate-450 font-mono mt-1 font-semibold flex items-center gap-1">
                              Phone: <span className="text-slate-850 dark:text-slate-205">{o.phone}</span>
                            </p>
                          </div>

                          {/* Status badges */}
                          <div>
                            {o.status === 'pending' && (
                              <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-500 font-mono text-[9px] uppercase tracking-wider font-extrabold animate-pulse">
                                Pending
                              </span>
                            )}
                            {o.status === 'delivered' && (
                              <span className="px-2.5 py-1 rounded bg-green-500/10 text-green-600 font-mono text-[9px] uppercase tracking-wider font-extrabold">
                                Delivered
                              </span>
                            )}
                            {o.status === 'cancelled' && (
                              <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-600 font-mono text-[9px] uppercase tracking-wider font-bold">
                                Cancelled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Shipment Address */}
                        <div className="text-xs leading-relaxed space-y-1">
                          <p className="font-bold text-slate-500">Destination Address:</p>
                          <p className="font-semibold text-slate-700 dark:text-slate-350">{o.address}</p>
                        </div>

                        {/* Culinary ordered lists recap */}
                        <div className="space-y-2 pt-1 border-t border-slate-50 dark:border-slate-800/30">
                          <p className="text-xs font-bold text-slate-500">Selected Platters:</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-xs font-semibold text-slate-650 dark:text-slate-350">
                                <span>• {it.name} <span className="font-mono text-[10px] text-slate-400 font-bold">× {it.quantity}</span></span>
                                <span className="font-mono">Rs. {it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Control panel buttons */}
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-xl">
                        <div className="text-xs">
                          <p className="text-slate-400">Total Bill Value</p>
                          <p className="font-sans font-black text-amber-500 text-sm">Rs. {o.totalAmount}</p>
                        </div>

                        {o.status === 'pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                              className="px-3.5 py-2 bg-green-500 hover:bg-green-650 text-white rounded-xl border-none font-sans font-bold text-[10px] cursor-pointer shadow-sm shadow-green-500/10"
                            >
                              Dispatch Food
                            </button>
                            <button 
                              onClick={() => handleUpdateOrderStatus(o.id, 'cancelled')}
                              className="p-2 bg-red-105 hover:bg-red-200 border border-slate-200 hover:border-red-500 dark:border-slate-800 hover:dark:border-red-500/20 text-red-500 rounded-xl font-sans font-bold text-[10px] cursor-pointer shadow-sm transition"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 3. Menu & Inventory Control Layout */}
          {activeTab === 'menu' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="menu"
              className="space-y-6"
            >
              {/* Trigger Add Form button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 border-none text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition"
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? 'Close Food Designer' : 'Add New Food Platter'}
                </button>
              </div>

              {/* Add Food Platter form modal code */}
              {showAddForm && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-left space-y-6"
                >
                  <h3 className="font-sans font-bold text-base text-slate-950 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">Create New Dish</h3>
                  <form onSubmit={handleAddFoodItem} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Dish Title</label>
                      <input 
                        type="text" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g. Garlic Naan, Tikka Roll"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Food Segment Category</label>
                      <select 
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as FoodCategory)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200 cursor-pointer"
                      >
                        <option value="chicken">Chicken BBQ Items</option>
                        <option value="rolls">Paratha Rolls</option>
                        <option value="burgers">Burgers</option>
                        <option value="shawarma">Shawarma</option>
                        <option value="bread">Bread / Naan</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Direct Media Image URL</label>
                      <input 
                        type="url" 
                        value={newItemImage}
                        onChange={(e) => setNewItemImage(e.target.value)}
                        placeholder="https://domain.com/dish.jpg"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Price (PKR / Rs.)</label>
                      <input 
                        type="number" 
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(Number(e.target.value))}
                        required
                        min={0}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Inventory Stock Level</label>
                      <input 
                        type="number" 
                        value={newItemStock}
                        onChange={(e) => setNewItemStock(Number(e.target.value))}
                        required
                        min={0}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-xs font-bold text-slate-500">Dish Descriptive Text</label>
                      <textarea 
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="Explain the spices, ingredients, or preparation method clearly."
                        rows={2}
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none dark:text-slate-200 resize-none"
                      ></textarea>
                    </div>

                    <div className="sm:col-span-3 flex justify-end">
                      <button 
                        type="submit"
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 border-none text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Publish Food to Menu
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Editing Form Modal */}
              {editingItem && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Edit Menu Properties</h3>
                    <form onSubmit={handleUpdateItemDetails} className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-550 font-bold block pb-1">Name</label>
                        <input 
                          type="text" 
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-slate-105 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-550 font-bold block pb-1">Price</label>
                        <input 
                          type="number" 
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          required
                          className="w-full px-3 py-2 bg-slate-105 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-550 font-bold block pb-1">Stock</label>
                        <input 
                          type="number" 
                          value={editingItem.stock}
                          onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                          required
                          className="w-full px-3 py-2 bg-slate-105 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-550 font-bold block pb-1">Description</label>
                        <textarea 
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-slate-105 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg resize-none"
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-2 text-xs pt-2">
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-amber-505 bg-amber-500 text-white rounded-lg font-bold border-none"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setEditingItem(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg font-bold border-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Food Inventory table catalog lists */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-400 font-mono select-none uppercase tracking-wider text-left">
                      <th className="pb-4 font-semibold">Dish Title</th>
                      <th className="pb-4 font-semibold">Category</th>
                      <th className="pb-4 font-semibold text-right">Price</th>
                      <th className="pb-4 font-semibold text-center">Stock level</th>
                      <th className="pb-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 border-none">
                        <td className="py-4 font-bold text-slate-900 dark:text-slate-150">
                          {item.name}
                        </td>
                        <td className="py-4 uppercase font-mono text-slate-500">
                          {item.category}
                        </td>
                        <td className="py-4 text-right font-sans font-black text-amber-500">
                          Rs. {item.price}
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleModifyStockValue(item, -1)}
                              className="w-6 h-6 border rounded hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-10 font-bold text-slate-700 dark:text-slate-200">
                              {item.stock}
                            </span>
                            <button 
                              onClick={() => handleModifyStockValue(item, 5)}
                              className="w-6 h-6 border rounded hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleStartEditing(item)}
                              className="p-1 rounded text-amber-505 hover:bg-amber-500/10 hover:text-amber-500 transition cursor-pointer"
                              title="Edit item Properties"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteFoodItem(item.id)}
                              className="p-1 rounded text-red-405 hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer"
                              title="Delete food platter"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
