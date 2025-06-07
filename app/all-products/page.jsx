'use client'
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from 'next/navigation';
import Loading from "@/components/Loading";
import axios from 'axios';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';

    const fetchProducts = async (pageNum = 1) => {
        try {
            const params = new URLSearchParams({
                page: pageNum,
                limit: 20,
                ...(categoryFilter && { category: categoryFilter }),
                ...(searchQuery && { search: searchQuery })
            });

            const { data } = await axios.get(`/api/product/list?${params}`);
            
            if (data.success) {
                if (pageNum === 1) {
                    setProducts(data.products);
                } else {
                    setProducts(prev => [...prev, ...data.products]);
                }
                setHasMore(data.pagination.hasMore);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setProducts([]);
        setLoading(true);
        fetchProducts(1);
    }, [searchQuery, categoryFilter]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading) {
                setPage(prev => prev + 1);
                fetchProducts(page + 1);
            }
        }, { threshold: 1.0 });

        const loadMoreTrigger = document.getElementById('loadMoreTrigger');
        if (loadMoreTrigger) {
            observer.observe(loadMoreTrigger);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, page]);

    const getPageTitle = () => {
        if (categoryFilter) return categoryFilter;
        if (searchQuery) return `Search Results for "${searchQuery}"`;
        return "All Products";
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 px-6 md:px-16 lg:px-32">
                    <div className="flex flex-col items-end pt-12">
                        <p className="text-2xl font-medium">{getPageTitle()}</p>
                        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                    </div>
                    {loading && products.length === 0 ? (
                        <Loading />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            {products.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    {categoryFilter ? 
                                        `No products found in category "${categoryFilter}"` :
                                        searchQuery ? 
                                            `No products found matching "${searchQuery}"` :
                                            "No products available"
                                    }
                                </div>
                            )}
                            {hasMore && <div id="loadMoreTrigger" className="h-10" />}
                        </>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AllProducts;
