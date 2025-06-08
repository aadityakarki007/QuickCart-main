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
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Include search and category params if they exist
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (categoryFilter) params.append('category', categoryFilter);
                
                const { data } = await axios.get(`/api/product/list?${params}`);
                
                if (data.success) {
                    setProducts(data.products);
                } else {
                    setError(data.message || 'Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, categoryFilter]);

    const getPageTitle = () => {
        if (categoryFilter) return `Category: ${categoryFilter}`;
        if (searchQuery) return `Search Results for "${searchQuery}"`;
        return "All Products";
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <Loading />
            </div>
            <Footer />
        </>
    );

    if (error) {
        console.error('Error in AllProducts:', error);
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-red-500">Failed to load products. Please try again later.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 px-6 md:px-16 lg:px-32">
                    <div className="flex flex-col items-end pt-12">
                        <p className="text-2xl font-medium">{getPageTitle()}</p>
                        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                        <p className="text-sm text-gray-500 mt-2">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                {categoryFilter ? 
                                    `No products found in category "${categoryFilter}"` :
                                    searchQuery ? 
                                        `No products found matching "${searchQuery}"` :
                                        "No products available"
                                }
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AllProducts;
