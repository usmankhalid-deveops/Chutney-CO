/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, MenuItem, CartItem, Order, FoodCategory } from '../types';
import { INITIAL_MENU_ITEMS, getLocalImageForDish } from '../data';

export type ViewType = 
  | 'home' 
  | 'menu' 
  | 'cart' 
  | 'checkout' 
  | 'receipt' 
  | 'dashboard' 
  | 'login' 
  | 'signup' 
  | 'admin-login' 
  | 'admin-dashboard';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loadingProfile: boolean;
  isReady: boolean;
  theme: 'light' | 'dark';
  currentView: ViewType;
  setView: (view: ViewType) => void;
  toggleTheme: () => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Auth Methods
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, role?: 'customer' | 'admin', adminId?: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Menu items state
  menuItems: MenuItem[];
  refreshMenu: () => Promise<void>;
  loadingMenu: boolean;
  
  // Shopping Cart state
  cart: CartItem[];
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Orders
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  orders: Order[];
  refreshCustomerOrders: () => Promise<void>;
  placeNewOrder: (details: { 
    recipientName: string; 
    recipientEmail: string; 
    recipientPhone: string; 
    phone: string; 
    address: string; 
    paymentMethod: 'cash' | 'card';
  }) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentView, setView] = useState<ViewType>('home');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Menu and Cart Context
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('rms_cart');
    return stored ? JSON.parse(stored) : [];
  });
  
  // Active / Order History
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Local sync for Cart
  useEffect(() => {
    localStorage.setItem('rms_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast dispatch
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync / Toggle Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('rms_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('rms_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(`Switched to ${nextTheme} theme`, 'info');
  };

  // Fetch Menu, auto-seeding if collection is empty
  const refreshMenu = async () => {
    setLoadingMenu(true);
    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    if (isLocalMock) {
      const storedMenu = localStorage.getItem('rms_local_menu');
      if (storedMenu) {
        try {
          setMenuItems(JSON.parse(storedMenu));
          setLoadingMenu(false);
          return;
        } catch (e) {
          localStorage.removeItem('rms_local_menu');
        }
      }
    }
    const path = 'menu';
    try {
      const q = query(collection(db, path));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Auto-seed the Firestore with initial items
        const seededList: MenuItem[] = [];
        for (const item of INITIAL_MENU_ITEMS) {
          const docRef = doc(collection(db, path));
          const completeItem: MenuItem = {
            ...item,
            id: docRef.id,
            category: item.category as FoodCategory
          };
          await setDoc(docRef, completeItem);
          seededList.push(completeItem);
        }
        setMenuItems(seededList);
        if (isLocalMock) {
          localStorage.setItem('rms_local_menu', JSON.stringify(seededList));
        }
        console.log('Firebase Firestore menu collection seeded automatically.');
      } else {
        const fetchedList: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          const rawItem = doc.data() as MenuItem;
          fetchedList.push({
            ...rawItem,
            imageUrl: getLocalImageForDish(rawItem.name) || rawItem.imageUrl || ''
          });
        });
        setMenuItems(fetchedList);
        if (isLocalMock) {
          localStorage.setItem('rms_local_menu', JSON.stringify(fetchedList));
        }
      }
    } catch (err) {
      // Fallback for offline simulation or permission issues
      const storedMenu = localStorage.getItem('rms_local_menu');
      if (storedMenu) {
        try {
          setMenuItems(JSON.parse(storedMenu));
        } catch (e) {
          const defaultList = INITIAL_MENU_ITEMS.map((item, idx) => ({
            ...item,
            id: `static-${idx}`,
            category: item.category as FoodCategory
          }));
          setMenuItems(defaultList);
        }
      } else {
        const defaultList = INITIAL_MENU_ITEMS.map((item, idx) => ({
          ...item,
          id: `static-${idx}`,
          category: item.category as FoodCategory
        }));
        setMenuItems(defaultList);
      }
      showToast('Offline fallback or check Firebase permissions for reading the menu', 'warning');
      console.warn(err);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Cart Management
  const addToCart = (item: MenuItem, qty = 1) => {
    if (item.stock <= 0 || !item.isAvailable) {
      showToast('Item is currently out of stock', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        const totalQty = existing.quantity + qty;
        if (totalQty > item.stock) {
          showToast(`Cannot add more. Limit is ${item.stock} in stock.`, 'warning');
          return prev;
        }
        showToast(`${item.name} quantity increased in cart`, 'success');
        return prev.map((c) => 
          c.menuItem.id === item.id ? { ...c, quantity: totalQty } : c
        );
      }
      showToast(`${item.name} added to cart`, 'success');
      return [...prev, { menuItem: item, quantity: qty }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((c) => {
      if (c.menuItem.id === itemId) {
        if (qty > c.menuItem.stock) {
          showToast(`Only ${c.menuItem.stock} items left in stock`, 'warning');
          return c;
        }
        return { ...c, quantity: qty };
      }
      return c;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, current) => {
    return acc + (current.menuItem.price * current.quantity);
  }, 0);

  // Sign out, signup, sign in
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('rms_is_mock_session');
      localStorage.removeItem('rms_mock_profile');
      setProfile(null);
      setUser(null);
      setCart([]);
      setOrders([]);
      setActiveOrder(null);
      setView('home');
      showToast('Logged out successfully', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const u = cred.user;
      localStorage.removeItem('rms_is_mock_session');
      localStorage.removeItem('rms_mock_profile');
      showToast(`Welcome back, ${u.displayName}!`, 'success');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        showToast('Please enable Google Sign-In provider in the Firebase Auth console.', 'warning');
      } else {
        showToast('Could not complete Google login. Check web redirect configurations.', 'error');
      }
      console.error(err);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem('rms_is_mock_session');
      localStorage.removeItem('rms_mock_profile');
      showToast('Logged in successfully', 'success');
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        const assignedRole = email.toLowerCase() === 'usmankhalid619131ics@gmail.com' ? 'admin' : 'customer';
        const fallbackName = email.toLowerCase() === 'usmankhalid619131ics@gmail.com' ? 'Master Admin (Simulated)' : 'Customer (Simulated)';
        
        const simulatedProfile: UserProfile = {
          uid: 'simulated-' + assignedRole,
          name: fallbackName,
          email: email,
          role: assignedRole,
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('rms_is_mock_session', 'true');
        localStorage.setItem('rms_mock_profile', JSON.stringify(simulatedProfile));
        
        setUser({
          uid: simulatedProfile.uid,
          email: simulatedProfile.email,
          displayName: simulatedProfile.name,
          emailVerified: true
        } as any);
        setProfile(simulatedProfile);
        setLoadingProfile(false);
        setIsReady(true);
        
        if (assignedRole === 'admin') {
          setView('admin-dashboard');
        } else {
          setView('home');
        }

        showToast('Simulated login bypass active. (Enable Email/Password in Firebase Auth Console to use live accounts)', 'info');
      } else {
        showToast(err.message || 'Login failed', 'error');
        throw err;
      }
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, role: 'customer' | 'admin' = 'customer', adminId?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = res.user;
      
      const assignedRole = email.toLowerCase() === 'usmankhalid619131ics@gmail.com' ? 'admin' : role;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        name: name,
        email: email,
        role: assignedRole,
        ...(assignedRole === 'admin' && adminId ? { adminId } : {}),
        createdAt: new Date().toISOString()
      });
      
      localStorage.removeItem('rms_is_mock_session');
      localStorage.removeItem('rms_mock_profile');
      showToast(`Account registered successfully as ${assignedRole}!`, 'success');
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        const assignedRole = email.toLowerCase() === 'usmankhalid619131ics@gmail.com' ? 'admin' : role;
        
        const simulatedProfile: UserProfile = {
          uid: 'simulated-' + assignedRole + '-' + Math.random().toString(36).substring(2, 7),
          name: name,
          email: email,
          role: assignedRole,
          ...(assignedRole === 'admin' && adminId ? { adminId } : {}),
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('rms_is_mock_session', 'true');
        localStorage.setItem('rms_mock_profile', JSON.stringify(simulatedProfile));
        
        setUser({
          uid: simulatedProfile.uid,
          email: simulatedProfile.email,
          displayName: simulatedProfile.name,
          emailVerified: true
        } as any);
        setProfile(simulatedProfile);
        setLoadingProfile(false);
        setIsReady(true);
        setView('home');

        showToast('Registered with simulated local profile. (Enable Email/Password in Firebase Auth Console for live accounts)', 'info');
      } else {
        showToast(err.message || 'Registration failed', 'error');
        throw err;
      }
    }
  };

  // Sync user profiles
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
      if (isLocalMock && !firebaseUser) {
        const savedMockProfile = localStorage.getItem('rms_mock_profile');
        if (savedMockProfile) {
          try {
            const prof = JSON.parse(savedMockProfile) as UserProfile;
            setUser({
              uid: prof.uid,
              email: prof.email,
              displayName: prof.name,
              emailVerified: true
            } as any);
            setProfile(prof);
            setLoadingProfile(false);
            setIsReady(true);
            return;
          } catch (e) {
            localStorage.removeItem('rms_is_mock_session');
            localStorage.removeItem('rms_mock_profile');
          }
        }
      }

      setUser(firebaseUser);
      setLoadingProfile(true);
      
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          
          if (snap.exists()) {
            const fetchedProfile = snap.data() as UserProfile;
            setProfile(fetchedProfile);
            // Auto redirect if profile matches
            if (fetchedProfile.role === 'admin' && currentView === 'login') {
              setView('admin-dashboard');
            } else if (currentView === 'login' || currentView === 'signup') {
              setView('home');
            }
          } else {
            // Profile doesn't exist in firestore yet (could happen with direct oauth sign-ins)
            const defaultRole = firebaseUser.email?.toLowerCase() === 'usmankhalid619131ics@gmail.com' ? 'admin' : 'customer';
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Restaurant Guest',
              email: firebaseUser.email || '',
              role: defaultRole,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
            
            if (defaultRole === 'admin' && currentView === 'login') {
              setView('admin-dashboard');
            } else {
              setView('home');
            }
          }
        } catch (e) {
          // If firestore read fails because of fresh rules, setup guest simulation profile
          console.warn('Firestore User Profiler: fallback configured.', e);
          const defaultRole = firebaseUser.email?.toLowerCase() === 'usmankhalid619131ics@gmail.com' ? 'admin' : 'customer';
          setProfile({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Guest User',
            email: firebaseUser.email || '',
            role: defaultRole,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setProfile(null);
      }
      
      setLoadingProfile(false);
      setIsReady(true);
    });

    return () => unsub();
  }, [currentView]);

  // Load Menu instantly
  useEffect(() => {
    refreshMenu();
  }, []);

  // Customer order history fetching
  const refreshCustomerOrders = async () => {
    if (!user) return;
    
    // Date normalization helper to prevent sorting failures on local date strings / timestamps
    const getMillis = (dateObj: any): number => {
      if (!dateObj) return 0;
      if (typeof dateObj === 'string') return new Date(dateObj).getTime();
      if (dateObj instanceof Date) return dateObj.getTime();
      if (typeof dateObj.getTime === 'function') return dateObj.getTime();
      if (typeof dateObj.toDate === 'function') return dateObj.toDate().getTime();
      if (dateObj.seconds !== undefined) return dateObj.seconds * 1000 + (dateObj.nanoseconds || 0) / 1000000;
      return 0;
    };

    const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
    if (isLocalMock) {
      const storedOrders = localStorage.getItem('rms_local_orders');
      const list: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
      const filtered = list.filter(o => o.userId === user.uid);
      filtered.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setOrders(filtered);
      return;
    }
    try {
      const qSnapshot = await getDocs(collection(db, 'orders'));
      const list: Order[] = [];
      qSnapshot.forEach((doc) => {
        const o = doc.data() as Order;
        if (o.userId === user.uid) {
          list.push(o);
        }
      });
      // Sort newest first
      list.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setOrders(list);
    } catch (e) {
      console.warn('Could not read user orders, running locally or check FireStore indexes.', e);
      // Fallback: Read local legacy backup in case reading from live DB errored
      const storedOrders = localStorage.getItem('rms_local_orders');
      const list: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
      const filtered = list.filter(o => o.userId === user.uid);
      filtered.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setOrders(filtered);
    }
  };

   // Checkout mechanism
  const placeNewOrder = async (details: { 
    recipientName: string; 
    recipientEmail: string; 
    recipientPhone: string; 
    phone: string; 
    address: string; 
    paymentMethod: 'cash' | 'card';
  }) => {
    if (!user || !profile) {
      showToast('Please sign in or register to place your order.', 'warning');
      setView('login');
      return;
    }
    
    if (cart.length === 0) {
      showToast('Your cart is completely empty', 'warning');
      return;
    }

    try {
      const orderRef = doc(collection(db, 'orders'));
      const itemsList = cart.map(c => ({
        itemId: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity
      }));

      const newOrder: Order = {
        id: orderRef.id,
        userId: user.uid,
        customerName: profile.name,
        customerEmail: profile.email,
        recipientName: details.recipientName,
        recipientEmail: details.recipientEmail,
        recipientPhone: details.recipientPhone,
        phone: details.phone,
        address: details.address,
        items: itemsList,
        totalAmount: cartTotal,
        paymentMethod: details.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(), // Use standard ISO string to remain uniform with JSON serializations
        updatedAt: new Date().toISOString()
      };

      const isLocalMock = localStorage.getItem('rms_is_mock_session') === 'true';
      let savedLocally = isLocalMock;

      if (!isLocalMock) {
        try {
          // Create in Firestore
          await setDoc(orderRef, newOrder);

          // Decrement the corresponding menu items stock locally and in DB
          for (const cartItem of cart) {
            const docRef = doc(db, 'menu', cartItem.menuItem.id);
            const nextStock = Math.max(0, cartItem.menuItem.stock - cartItem.quantity);
            await updateDoc(docRef, {
              stock: nextStock,
              isAvailable: nextStock > 0
            });
          }
        } catch (dbErr) {
          console.warn('Firestore Order Placement failed, falling back to local persistence.', dbErr);
          savedLocally = true;
          // Set simulated local mode for this session since cloud db rejected or is unconfigured
          localStorage.setItem('rms_is_mock_session', 'true');
        }
      }

      if (savedLocally) {
        // Save to custom local orders in localStorage
        const storedOrders = localStorage.getItem('rms_local_orders');
        const list: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
        list.push(newOrder);
        localStorage.setItem('rms_local_orders', JSON.stringify(list));
        
        // Decrement menu items stock only locally
        setMenuItems((prev) => 
          prev.map((menuItem) => {
            const cartItem = cart.find(c => c.menuItem.id === menuItem.id);
            if (cartItem) {
              const nextStock = Math.max(0, menuItem.stock - cartItem.quantity);
              return {
                ...menuItem,
                stock: nextStock,
                isAvailable: nextStock > 0
              };
            }
            return menuItem;
          })
        );
        
        const storedMenu = localStorage.getItem('rms_local_menu');
        if (storedMenu) {
          try {
            let mList: MenuItem[] = JSON.parse(storedMenu);
            mList = mList.map((menuItem) => {
              const cartItem = cart.find(c => c.menuItem.id === menuItem.id);
              if (cartItem) {
                const nextStock = Math.max(0, menuItem.stock - cartItem.quantity);
                return {
                  ...menuItem,
                  stock: nextStock,
                  isAvailable: nextStock > 0
                };
              }
              return menuItem;
            });
            localStorage.setItem('rms_local_menu', JSON.stringify(mList));
          } catch (e) {
            console.warn(e);
          }
        }
      }

      // Update Local menu list
      await refreshMenu();

      // Update Customer orders list in memory so dashboard gets it immediately
      await refreshCustomerOrders();

      // Show success, save activeOrder for receipt page
      setActiveOrder(newOrder);
      clearCart();
      setView('receipt');
      showToast(savedLocally ? 'Simulated Order placed successfully (Offline Mode).' : 'Order placed successfully! Cooking will start shortly.', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      profile,
      loadingProfile,
      isReady,
      theme,
      currentView,
      setView,
      toggleTheme,
      toasts,
      showToast,
      removeToast,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      menuItems,
      refreshMenu,
      loadingMenu,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      cartTotal,
      activeOrder,
      setActiveOrder,
      orders,
      refreshCustomerOrders,
      placeNewOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
