// app/search/page.js
import ProductCard from '../components/ProductCard';

async function getProducts(query) {
  // don't call the API for empty queries
  if (!query || !query.trim()) return [];

  const q = encodeURIComponent(query.trim());
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${base}/api/products/search?name=${q}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      // log server-side for debugging
      // console.error('Search API returned status', res.status, await res.text());
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // console.error('Search fetch failed:', err);
    return [];
  }
}

const SearchPage = async ({ searchParams }) => {
  const query = searchParams?.query || ''; // page URL uses ?query=...
  const products = await getProducts(query);

  // server-side log (shows in terminal), handy while debugging
  // console.log('SearchPage - query:', query, 'results:', products.length);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Search Results for: {query}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product._id ?? product.id} product={product} />)
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
