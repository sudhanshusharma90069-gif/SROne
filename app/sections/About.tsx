const features = [
  {
    title: 'AI Deal Curation',
    desc: 'Our assistant scans 70+ stores and highlights only the best offers worth your money.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    title: 'Every Category Covered',
    desc: 'Shopping, groceries, food, hotels, flights, beauty — one platform for all savings.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    ),
  },
  {
    title: 'Instant Store Access',
    desc: 'One click takes you to the store with our affiliate link — savings applied automatically.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H21m0 0v7.5M21 6L10 17m-1.5-3.5H5a1 1 0 01-1-1V6a1 1 0 011-1h6.5" />
    ),
  },
  {
    title: 'Trusted Stores Only',
    desc: 'We only list verified, popular Indian marketplaces and booking platforms.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    title: '24/7 AI Assistant',
    desc: 'Ask anything — best hotel site, cheapest flight, latest fashion sale — get instant answers.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8m-8 4h5m-9 8l3-3h10a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
    ),
  },
  {
    title: 'Completely Free',
    desc: 'No sign-up, no fees. Browse deals and use affiliate links to unlock savings.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Shop Through SROne?</h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            We bring the best offers from India&apos;s top online stores into one clean, AI-assisted
            experience. Click any deal to unlock discounts, cashback, and exclusive affiliate rewards.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-accent/15 text-brand-accent flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
