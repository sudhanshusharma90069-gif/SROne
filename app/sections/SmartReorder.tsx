'use client';

import { useEffect, useState } from 'react';
import { getSavedItems, setSavedItems, addSavedItem, SavedItem } from '../lib/auto-list';
import { formatPrice, computePrices } from '../lib/prices';

const SAMPLE_STORES = ['JioMart', 'BigBasket', 'Blinkit', 'Nykaa', 'Amazon', 'Flipkart'];
const SAMPLE_NOTES = ['Due in 2 days', 'Lowest price today!', 'Delivery in 9 mins', 'Restock soon'];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SmartReorder() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => setItems(getSavedItems());

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('srone-auto-list', handler);
    return () => window.removeEventListener('srone-auto-list', handler);
  }, []);

  function persist(next: SavedItem[]) {
    setSavedItems(next);
    setItems(next);
  }

  function toggle(id: number) {
    const next = items.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i));
    persist(next);
  }

  function add() {
    const val = newItem.trim();
    if (!val) return;
    const { originalPrice, discountedPrice } = computePrices({
      category: 'Grocery & Quick Commerce',
      discount: '20% OFF',
    });
    addSavedItem({
      id: Date.now(),
      name: val,
      category: 'Groceries',
      bestStore: randomPick(SAMPLE_STORES),
      mrp: originalPrice,
      bestPrice: discountedPrice,
      selected: true,
      frequency: 'Saved Forever • Auto-Tracked',
      nextDue: randomPick(SAMPLE_NOTES),
      autoSubscribe: false,
    });
    setNewItem('');
    setNotice(`"${val}" aapki permanent order list mein save ho gaya!`);
    setTimeout(() => setNotice(''), 3000);
  }

  function reorder() {
    const selected = items.filter((i) => i.selected);
    if (selected.length === 0) {
      setNotice('Kripya kam se kam 1 item select karein!');
      setTimeout(() => setNotice(''), 3000);
      return;
    }
    setNotice(`${selected.length} items lowest price par reorder ke liye ready hain!`);
    setTimeout(() => setNotice(''), 3000);
  }

  function remove(id: number) {
    const next = items.filter((i) => i.id !== id);
    persist(next);
  }

  const total = items.filter((i) => i.selected).reduce((sum, i) => sum + i.bestPrice, 0);
  const totalSaved = items
    .filter((i) => i.selected)
    .reduce((sum, i) => sum + (i.mrp - i.bestPrice), 0);

  return (
    <section id="smart-reorder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-gradient-to-br from-brand-800 via-[#191726] to-brand-800 border border-brand-accent/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full mb-2">
              <span>🔄</span> Time-Saver Auto-List
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Aapki Pre-Saved Order List (Dobara Search Nahi Karna Padega)
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Jo items aap regularly order karte hain, AI ne pehle se list karke aaj ka sabse sasta store select kar liya hai.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-right">
              <div className="text-xs text-gray-400">Selected List Total (Best Store Price)</div>
              <div className="text-xl font-extrabold text-emerald-400">
                {formatPrice(total)} <span className="text-xs text-brand-accent font-normal">(Saved {formatPrice(totalSaved)})</span>
              </div>
            </div>
            <button
              onClick={reorder}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold px-5 py-3.5 rounded-xl text-sm transition shadow-lg"
            >
              1-Click Reorder Selected
            </button>
          </div>
        </div>

        {notice && (
          <p className="mb-4 text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-2">{notice}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Koi naya item hamesha ke liye list mein jodein..."
            className="flex-1 bg-black/50 border border-white/10 focus:border-brand-accent rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          />
          <button
            onClick={add}
            className="bg-brand-accent hover:bg-brand-accent-hover text-black font-bold px-5 py-2.5 rounded-xl text-sm transition whitespace-nowrap"
          >
            + Permanent List Mein Add Karein
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-black/40 border ${item.selected ? 'border-brand-accent/60' : 'border-white/10 opacity-60'} rounded-xl p-4 flex flex-col justify-between transition`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="bg-brand-accent/20 text-brand-accent font-bold px-2.5 py-0.5 rounded-full">{item.bestStore} Best Price</span>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggle(item.id)}
                    className="w-4 h-4 accent-brand-accent cursor-pointer"
                    title="Include in reorder"
                  />
                </div>
                <h3 className="font-bold text-white text-base">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1">🔄 {item.frequency}</p>
                <p className="text-xs text-emerald-400 font-medium mt-1">⚡ {item.nextDue}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 line-through">{formatPrice(item.mrp)}</span>
                  <span className="text-lg font-extrabold text-white ml-1">{formatPrice(item.bestPrice)}</span>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
