// @ts-nocheck
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag, Plane, Film, Sparkles, TrendingDown, Bell, ExternalLink,
  Search, SlidersHorizontal, Activity, CheckCircle2, AlertCircle, X,
  ChevronRight, ArrowUpRight, ShieldCheck, Zap, History, Eye, Bot,
  Send, Loader2, Moon, Sun, Plus, Trash2, BarChart3, Tag, Compass,
  Smartphone, Tv, Headphones, Hotel, Train, Ticket, Flame, ThumbsUp,
  RefreshCw, Layers, Lock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getUsage, addUsage } from '../lib/usage';
import { getSavedItems, addSavedItem } from '../lib/auto-list';
import { getPriceAlerts, savePriceAlert } from '../lib/price-alerts';
import { computePrices } from '../lib/prices';
import SmartReorder from '../sections/SmartReorder';
import AIPredictions from '../sections/AIPredictions';
import CartOptimizer from '../components/CartOptimizer';
import ChatWidget from '../components/ChatWidget';
import Header from '../components/Header';
import About from '../sections/About';
import Footer from '../sections/Footer';

const generate30DayHistory = (basePrice, currentPrice, lowestPrice, highestPrice) => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    let price;
    if (i === 0) {
      price = currentPrice;
    } else if (i === 14) {
      price = highestPrice;
    } else if (i === 6) {
      price = lowestPrice;
    } else {
      const variance = (Math.random() - 0.45) * (highestPrice - lowestPrice) * 0.4;
      price = Math.round(Math.max(lowestPrice, Math.min(highestPrice, basePrice + variance)));
    }
    data.push({ date: dateStr, price });
  }
  return data;
};

const INITIAL_DEALS = [
  {
    id: 'shp-1',
    category: 'shopping',
    subCategory: 'Electronics',
    title: 'Apple iPhone 16 (128GB, Ultramarine)',
    platform: 'Amazon',
    platformColor: 'bg-amber-500 text-slate-950',
    platformUrl: 'https://www.amazon.in',
    currentPrice: 71999,
    originalPrice: 79900,
    lowest30d: 71999,
    highest30d: 79900,
    avg30d: 76450,
    rating: 4.8,
    reviews: '4.2k',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    aiMatchScore: 98,
    aiReason: 'Matches your 4 recent searches for flagship smartphones & Apple ecosystem.',
    verdict: 'historical_low',
    verdictText: 'Lowest Price in 30 Days — Buy Now!',
    couponCode: 'ICICI4000',
    couponDiscount: 4000,
    history: generate30DayHistory(76000, 71999, 71999, 79900)
  },
  {
    id: 'shp-2',
    category: 'shopping',
    subCategory: 'Audio',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    platform: 'Flipkart',
    platformColor: 'bg-blue-600 text-white',
    platformUrl: 'https://fktr.in/4OT7HyJ',
    currentPrice: 24990,
    originalPrice: 34990,
    lowest30d: 23990,
    highest30d: 29990,
    avg30d: 27200,
    rating: 4.7,
    reviews: '8.9k',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80',
    aiMatchScore: 94,
    aiReason: 'Curated because you viewed flights & travel accessories recently.',
    verdict: 'good_deal',
    verdictText: '₹2,210 below 30-day average',
    couponCode: 'AUDIO10',
    couponDiscount: 2000,
    history: generate30DayHistory(27200, 24990, 23990, 29990)
  },
  {
    id: 'shp-3',
    category: 'shopping',
    subCategory: 'Laptops',
    title: 'MacBook Air M3 (13.6", 16GB RAM, 256GB SSD)',
    platform: 'Amazon',
    platformColor: 'bg-amber-500 text-slate-950',
    platformUrl: 'https://www.amazon.in',
    currentPrice: 99990,
    originalPrice: 114900,
    lowest30d: 99990,
    highest30d: 112900,
    avg30d: 106500,
    rating: 4.9,
    reviews: '1.8k',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    aiMatchScore: 96,
    aiReason: 'High affinity with your Web Development & AI workflow interest.',
    verdict: 'historical_low',
    verdictText: 'All-Time 30D Low — Auto-Coupon Applied',
    couponCode: 'MACHDFC',
    couponDiscount: 5000,
    history: generate30DayHistory(106500, 99990, 99990, 112900)
  },
  {
    id: 'TRV-1',
    category: 'booking',
    subCategory: 'Flights',
    title: 'Direct Flight: Patna / Delhi to Goa (IndiGo Non-Stop)',
    platform: 'MakeMyTrip',
    platformColor: 'bg-red-600 text-white',
    platformUrl: 'https://www.makemytrip.com',
    currentPrice: 3849,
    originalPrice: 6499,
    lowest30d: 3849,
    highest30d: 7200,
    avg30d: 5120,
    rating: 4.6,
    reviews: 'Verified Fare',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    aiMatchScore: 97,
    aiReason: 'Fare dropped 24% in the last 6 hours based on your weekend travel pattern.',
    verdict: 'historical_low',
    verdictText: '30-Day Lowest Fare — Book Immediately',
    couponCode: 'MMTFLY',
    couponDiscount: 500,
    history: generate30DayHistory(5120, 3849, 3849, 7200)
  },
  {
    id: 'ENT-1',
    category: 'entertainment',
    subCategory: 'OTT Bundle',
    title: 'All-in-One Annual OTT Pass (Netflix + Prime + Disney+ Hotstar 4K)',
    platform: 'JioFiber / Tata Play Binge',
    platformColor: 'bg-purple-600 text-white',
    platformUrl: 'https://www.jio.com',
    currentPrice: 2499,
    originalPrice: 5499,
    lowest30d: 2499,
    highest30d: 4999,
    avg30d: 3599,
    rating: 4.9,
    reviews: '12.4k',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80',
    aiMatchScore: 99,
    aiReason: 'Matches your video streaming & multi-device household usage!',
    verdict: 'historical_low',
    verdictText: '55% Off Annual Bundle — Best Value',
    couponCode: 'BINGE50',
    couponDiscount: 300,
    history: generate30DayHistory(3599, 2499, 2499, 4999)
  }
];

function toPulseDeal(d, usage = {}) {
  const original = d.originalPrice ?? computePrices(d).originalPrice;
  const current = d.discountedPrice ?? computePrices(d).discountedPrice;
  const low = Math.min(original, current);
  const high = Math.max(original, current);
  const avg = Math.round((original + current) / 2);
  const matchBoost = (usage[d.category] || 0) * 2;
  const match = Math.min(99, 85 + matchBoost + Math.floor(Math.random() * 6));
  const saving = original - current;
  const discountPct = original ? Math.round((saving / original) * 100) : 0;
  const categoryName = (d.category || '').toLowerCase();
  const pulseCategory = /travel|hotel|railway|airport|recharge/.test(categoryName)
    ? 'booking'
    : /entertainment|movies|streaming|ott/.test(categoryName)
    ? 'entertainment'
    : 'shopping';
  const platformColor = (() => {
    const p = (d.store || '').toLowerCase();
    if (p.includes('amazon')) return 'bg-amber-500 text-slate-950';
    if (p.includes('flipkart')) return 'bg-blue-600 text-white';
    if (p.includes('myntra')) return 'bg-rose-500 text-white';
    if (p.includes('bigbasket')) return 'bg-lime-600 text-white';
    if (p.includes('blinkit')) return 'bg-emerald-500 text-slate-950';
    if (p.includes('jio')) return 'bg-purple-600 text-white';
    if (p.includes('makemytrip') || p.includes('mmt')) return 'bg-red-600 text-white';
    return 'bg-indigo-500 text-white';
  })();
  const image =
    d.image ||
    (pulseCategory === 'booking'
      ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'
      : pulseCategory === 'entertainment'
      ? 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=600&q=80');
  return {
    id: `${(d.store || 'deal').replace(/\s+/g, '-').toLowerCase()}-${(d.title || '').slice(0, 24).replace(/\s+/g, '-') || Date.now()}`,
    category: pulseCategory,
    subCategory: d.category || 'Shopping',
    title: d.title,
    platform: d.store,
    platformColor,
    platformUrl: d.link,
    currentPrice: current,
    originalPrice: original,
    lowest30d: low,
    highest30d: high,
    avg30d: avg,
    rating: 4.5,
    reviews: d.store || 'Verified',
    image,
    aiMatchScore: match,
    aiReason: d.ai_summary || `Top pick from ${d.store} in ${d.category}.`,
    verdict: saving > 0 ? 'historical_low' : 'good_deal',
    verdictText: saving > 0 ? `${discountPct}% OFF — Lowest today` : 'Best available price',
    couponCode: d.discount || '',
    couponDiscount: saving,
    history: generate30DayHistory(avg, current, low, high),
  };
}

export default function App({ initialDeals = [] } = {}) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyLowest30d, setOnlyLowest30d] = useState(false);

  const [userInterests, setUserInterests] = useState([
    'Laptops & Web Dev', 'Flagship Phones', '4K OTT Streaming', 'Weekend Flights'
  ]);
  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'Analyzed 30-day price graph for MacBook Air M3', time: '2m ago', type: 'analysis' },
    { id: 2, action: 'Auto-scanned platforms for OTT & Broadband bundles', time: '8m ago', type: 'automation' },
    { id: 3, action: 'Detected 30-day lowest price on iPhone 16 (Amazon)', time: '15m ago', type: 'drop' },
  ]);

  const [aiAutomations, setAiAutomations] = useState({
    autoTrackHistory: true,
    autoApplyCoupons: true,
    instantPriceDropSnipe: true,
    crossPlatformCompare: true,
  });

  const [selectedDealForAnalytics, setSelectedDealForAnalytics] = useState(null);
  const [alertModalDeal, setAlertModalDeal] = useState(null);
  const [targetAlertPrice, setTargetAlertPrice] = useState('');
  const [alertChannel, setAlertChannel] = useState('WhatsApp + Push');
  const [showAlertsDrawer, setShowAlertsDrawer] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [redirectingDeal, setRedirectingDeal] = useState(null);

  const initialPulse = initialDeals.length
    ? initialDeals.map((d) => toPulseDeal(d, {}))
    : INITIAL_DEALS;
  const [deals, setDeals] = useState(initialPulse);
  const [sroLoading, setSroLoading] = useState(true);

  useEffect(() => {
    async function loadSroDeals() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        const raw = data?.deals || [];
        if (raw.length > 0) {
          const usage = getUsage();
          setDeals(raw.map((d) => toPulseDeal(d, usage)));
        }
      } catch (err) {
        console.error('SROne deals fetch failed', err);
      } finally {
        setSroLoading(false);
      }
    }
    loadSroDeals();
  }, []);

  const [priceAlerts, setPriceAlerts] = useState([
    {
      id: 'al-1',
      dealId: 'shp-1',
      title: 'Apple iPhone 16 (128GB)',
      platform: 'Amazon',
      currentPrice: 71999,
      targetPrice: 70000,
      channel: 'WhatsApp + Push',
      status: 'Monitoring 24/7',
      createdAt: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    const saved = getPriceAlerts();
    if (saved.length > 0) setPriceAlerts(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('srone-price-alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'नमस्ते! मैं आपका **SROne AI Assistant** हूँ। मैंने आपके पिछले सर्च और यूज़ेज को एनालाइज करके आज की सबसे बेहतरीन 30-Day Lowest Deals ऊपर सेट कर दी हैं।'
    }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiChatOpen]);

  const logUserAction = (actionText, interestTag = null) => {
    setActivityLog(prev => [
      { id: Date.now(), action: actionText, time: 'Just now', type: 'user' },
      ...prev.slice(0, 7)
    ]);
    if (interestTag && !userInterests.includes(interestTag)) {
      setUserInterests(prev => [interestTag, ...prev.slice(0, 5)]);
    }
  };

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesCategory = activeCategory === 'all' || deal.category === activeCategory;
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLowest = !onlyLowest30d || deal.currentPrice <= deal.lowest30d;
      return matchesCategory && matchesSearch && matchesLowest;
    }).sort((a, b) => b.couponDiscount - a.couponDiscount);
  }, [activeCategory, searchQuery, onlyLowest30d]);

  const topAiCuratedDeals = useMemo(() => {
    return [...deals]
      .sort((a, b) => b.couponDiscount - a.couponDiscount)
      .slice(0, 6);
  }, [deals]);

  const handleOpenAnalytics = (deal) => {
    setSelectedDealForAnalytics(deal);
    logUserAction(`Checked 30-day price history for ${deal.title.slice(0, 25)}...`, deal.subCategory);
  };

  const handleOpenAlertModal = (deal) => {
    setAlertModalDeal(deal);
    setTargetAlertPrice(Math.round(deal.currentPrice * 0.93).toString());
  };

  const handleSavePriceAlert = (e) => {
    e.preventDefault();
    if (!alertModalDeal || !targetAlertPrice) return;
    const numericTarget = Number(targetAlertPrice);
    const newAlert = {
      id: `al-${Date.now()}`,
      dealId: alertModalDeal.id,
      title: alertModalDeal.title,
      platform: alertModalDeal.platform,
      currentPrice: alertModalDeal.currentPrice,
      targetPrice: numericTarget,
      channel: alertChannel,
      status: numericTarget >= alertModalDeal.currentPrice ? 'Target Hit!' : 'Monitoring 24/7',
      createdAt: new Date().toISOString()
    };
    setPriceAlerts(prev => [newAlert, ...prev]);
    logUserAction(`Set Price Alert @ ₹${numericTarget.toLocaleString('en-IN')} for ${alertModalDeal.title.slice(0, 20)}...`, alertModalDeal.subCategory);
    setAlertModalDeal(null);
  };

  const handleDirectRedirect = (deal) => {
    logUserAction(`Redirected to ${deal.platform} for ${deal.title.slice(0, 25)}...`, deal.subCategory);
    setRedirectingDeal(deal);
    setTimeout(() => {
      window.open(deal.platformUrl, '_blank', 'noopener,noreferrer');
    }, 1200);
  };

  const handleSendMessage = async (customPrompt = null) => {
    const queryText = customPrompt || chatInput;
    if (!queryText.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', text: queryText }];
    setChatMessages(newMessages);
    if (!customPrompt) setChatInput('');
    setIsAiLoading(true);
    logUserAction(`Asked AI Assistant: "${queryText.slice(0, 30)}..."`);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'मेरी 30-Day Price Analysis के अनुसार **MacBook Air M3 (₹99,990)**, **iPhone 16 (₹71,999)** और **All-in-One OTT Pass (₹2,499)** अभी अपने 30-दिन के सबसे निचले स्तर पर हैं।'
        }
      ]);
      setIsAiLoading(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header />
      
      {/* Top AI Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold tracking-wide">AI BEHAVIOR & 30D PRICE TRACKER ACTIVE</span>
          </div>
          <button
            onClick={() => setShowAutomationModal(true)}
            className="underline hover:text-amber-200 font-medium flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5" /> Configure AI Automation
          </button>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SROne AI
                </h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Super-App
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Shopping • Booking • Entertainment • 30D Price Intelligence
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-auto w-full order-3 md:order-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amazon, MakeMyTrip, OTT, iPhone, Flights..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
                    : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 order-2 md:order-3">
            <button
              onClick={() => setShowAlertsDrawer(true)}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50 text-slate-200'
                  : 'bg-white border-slate-200 hover:border-amber-500 text-slate-700 shadow-sm'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Price Alerts</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-slate-950 font-bold">
                {priceAlerts.length}
              </span>
            </button>

            <button
              onClick={() => setIsAiChatOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border ${
                darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Personalized AI Radar */}
        <section className={`rounded-2xl p-5 border relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30'
            : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-sm'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/60">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Sparkles className="w-4 h-4" /> AI Past-Usage Predictive Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Front-Page Deals Curated from Your Activity
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Tracked Interests:
              </span>
              {userInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border ${
                    darkMode ? 'bg-slate-900/90 border-slate-700 text-indigo-300' : 'bg-white border-indigo-200 text-indigo-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {topAiCuratedDeals.map((deal, index) => {
              const discountPercent = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100);
              return (
                <div
                  key={deal.id}
                  className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    darkMode ? 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/60' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {deal.aiMatchScore}% AI Match #{index + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${deal.platformColor}`}>
                        {deal.platform}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img src={deal.image} alt={deal.title} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-700" />
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{deal.title}</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-extrabold text-emerald-400">₹{deal.currentPrice.toLocaleString('en-IN')}</span>
                          <span className="text-xs line-through text-slate-500">₹{deal.originalPrice.toLocaleString('en-IN')}</span>
                          <span className="text-xs font-bold text-rose-400">-{discountPercent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/60">
                    <button
                      onClick={() => handleOpenAnalytics(deal)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <BarChart3 className="w-3.5 h-3.5" /> 30D Low: ₹{deal.lowest30d.toLocaleString('en-IN')}
                    </button>
                    <button
                      onClick={() => handleDirectRedirect(deal)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1"
                    >
                      Direct Deal <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Platform Categories & Filter */}
        <section id="deals" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className={`inline-flex p-1.5 rounded-2xl border overflow-x-auto ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/70 border-slate-300'
            }`}>
              {[
                { id: 'all', label: 'All Platforms', icon: Layers, count: INITIAL_DEALS.length },
                { id: 'shopping', label: 'Shopping', icon: ShoppingBag, count: 3 },
                { id: 'booking', label: 'Travel & Booking', icon: Plane, count: 1 },
                { id: 'entertainment', label: 'OTT & Media', icon: Film, count: 1 },
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setOnlyLowest30d(!onlyLowest30d)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                onlyLowest30d
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Only 30-Day Lowest Price Deals</span>
            </button>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map(deal => {
              const isAt30dLow = deal.currentPrice <= deal.lowest30d;
              const savings = deal.originalPrice - deal.currentPrice;
              const discountPct = Math.round((savings / deal.originalPrice) * 100);
              const hasActiveAlert = priceAlerts.some(a => a.dealId === deal.id);

              return (
                <div
                  key={deal.id}
                  onClick={() => handleDirectRedirect(deal)}
                  className={`cursor-pointer rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
                    darkMode ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-800">
                      <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-md ${deal.platformColor}`}>{deal.platform}</span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3" /> {deal.aiMatchScore}% Match
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          isAt30dLow ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500/90 text-slate-950'
                        }`}>
                          <TrendingDown className="w-3.5 h-3.5" /> {deal.verdictText}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-base line-clamp-2 group-hover:text-indigo-400 transition-colors">{deal.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="line-clamp-1">{deal.aiReason}</span>
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-emerald-400">₹{deal.currentPrice.toLocaleString('en-IN')}</span>
                            <span className="text-sm line-through text-slate-500">₹{deal.originalPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">You save ₹{savings.toLocaleString('en-IN')} ({discountPct}% off)</span>
                        </div>

                        {deal.couponCode && (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-semibold">
                              <Tag className="w-3 h-3" /> {deal.couponCode}
                            </span>
                            <p className="text-[10px] text-emerald-400 mt-0.5">Auto-applied</p>
                          </div>
                        )}
                      </div>

                      {/* Sparkline box */}
                      <div
                        onClick={(e) => { e.stopPropagation(); handleOpenAnalytics(deal); }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold flex items-center gap-1.5 text-indigo-400">
                            <History className="w-3.5 h-3.5" /> Last 30 Days Trend
                          </span>
                          <span className="text-[11px] underline text-slate-400">View Graph →</span>
                        </div>
                        <div className="h-14 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={deal.history}>
                              <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={0.2} fill="#10b981" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenAlertModal(deal); }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        hasActiveAlert ? 'bg-amber-500/20 border-amber-500 text-amber-300' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span>{hasActiveAlert ? 'Alert Set' : 'Alert'}</span>
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDirectRedirect(deal); }}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
                    >
                      <span>Buy on {deal.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <AIPredictions />
        <SmartReorder />
        <CartOptimizer />
      </main>

      {/* Analytics Modal */}
      {selectedDealForAnalytics && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-5 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${selectedDealForAnalytics.platformColor}`}>
                  {selectedDealForAnalytics.platform}
                </span>
                <h3 className="text-lg font-bold mt-1">{selectedDealForAnalytics.title}</h3>
                <p className="text-xs text-slate-400">Verified 30-Day Historical Price Tracker & AI Recommendation</p>
              </div>
              <button onClick={() => setSelectedDealForAnalytics(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 block">Current</span>
                <span className="text-lg font-extrabold text-emerald-400">₹{selectedDealForAnalytics.currentPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <span className="text-xs text-indigo-300 block">30D Lowest</span>
                <span className="text-lg font-bold text-indigo-400">₹{selectedDealForAnalytics.lowest30d.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs text-slate-400 block">30D Average</span>
                <span className="text-lg font-bold">₹{selectedDealForAnalytics.avg30d.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-xs text-rose-300 block">30D Highest</span>
                <span className="text-lg font-bold text-rose-400">₹{selectedDealForAnalytics.highest30d.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedDealForAnalytics.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const deal = selectedDealForAnalytics;
                  setSelectedDealForAnalytics(null);
                  handleOpenAlertModal(deal);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-amber-500/50 text-amber-400"
              >
                Set Price Drop Alert
              </button>
              <button
                onClick={() => {
                  const deal = selectedDealForAnalytics;
                  setSelectedDealForAnalytics(null);
                  handleDirectRedirect(deal);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
              >
                Go Directly to {selectedDealForAnalytics.platform}
              </button>
            </div>
          </div>
        </div>
      )}

      <About />
      <Footer />
      <ChatWidget />
    </div>
  );
}