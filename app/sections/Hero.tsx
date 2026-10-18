const stats = [
  { value: '38+', label: 'Top Stores' },
  { value: '11', label: 'Categories' },
  { value: 'AI', label: 'Curated Deals' },
  { value: '100%', label: 'Free to Use' },
];

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 hero-glow dot-grid overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          AI-powered deal recommendations — live now
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
          Every Deal. Every Store.
          <br className="hidden sm:block" />
          <span className="gradient-text">One Smart Platform.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
          SROne uses AI to surface the best discounts across shopping, groceries, food delivery,
          hotels, flights and more — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#deals"
            className="px-8 py-4 rounded-xl bg-brand-accent text-brand-900 font-bold text-lg hover:bg-brand-accent-hover transition-all hover:scale-105 shadow-lg shadow-brand-accent/20"
          >
            Explore Best Deals
          </a>
          <a
            href="#about"
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
          >
            Why SROne
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
