import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

export function useProducts(category = '') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: 12,
        ...(category && { category })
      });

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setProducts(prev => page === 1 ? data.products : [...prev, ...data.products]);
      setHasMore(data.hasMore);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  // Initial load
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts();
  }, [category]);

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMoreRef: ref
  };
}
