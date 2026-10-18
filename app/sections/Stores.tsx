import StoreCard from '../components/StoreCard';
import { storeCategories } from '../lib/stores';

export default function Stores() {
  return (
    <section id="stores" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Shop from Your Favorite Stores</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trusted platforms handpicked for the best savings — organized by category.
          </p>
        </div>
        {storeCategories.map((category) => (
          <div key={category.name} className="mb-14 last:mb-0">
            <h3 className="text-xl font-bold text-brand-accent mb-6">{category.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.stores.map((store) => (
                <StoreCard key={store.name} store={store} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
