import { storeCategories } from '../lib/stores';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto bg-brand-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-[#ff6c37] flex items-center justify-center">
                <span className="text-brand-900 font-extrabold text-sm tracking-tight">SR</span>
              </div>
              <p className="text-white font-bold text-xl">
                SR<span className="text-brand-accent">One</span>
              </p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              AI-curated deals from India&apos;s top stores. One platform for shopping, groceries,
              food, hotels and travel savings.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Categories</h4>
            <ul className="grid grid-cols-2 gap-2">
              {storeCategories.slice(0, 8).map((c) => (
                <li key={c.name}>
                  <a
                    href={c.stores[0]?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-brand-accent transition-colors"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#deals" className="text-sm text-gray-400 hover:text-brand-accent transition-colors">Best Deals</a></li>
              <li><a href="#about" className="text-sm text-gray-400 hover:text-brand-accent transition-colors">About</a></li>
              <li><a href="mailto:suddhanshusharma96@gmail.com" className="text-sm text-gray-400 hover:text-brand-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Founders</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <p className="text-white font-semibold">Suddhanshu &amp; Rakhi Kumari</p>
                <p className="text-xs text-gray-500">Founders, SROne</p>
              </li>
              <li>
                <a href="tel:+917979010289" className="hover:text-brand-accent transition-colors">+91 79790 10289</a>
              </li>
              <li>
                <a href="mailto:suddhanshusharma96@gmail.com" className="hover:text-brand-accent transition-colors break-all">
                  suddhanshusharma96@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">
            &copy; {new Date().getFullYear()} SROne. All rights reserved. Founded by Suddhanshu &amp; Rakhi Kumari.
          </p>
          <p className="text-xs text-gray-600 max-w-xl mx-auto">
            This website contains affiliate links. We may earn a commission when you shop through
            our links — at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
