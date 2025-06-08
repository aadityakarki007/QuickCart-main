'use client'
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation';

const AllProducts = () => {
    const { products } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState(products);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';

    useEffect(() => {
        let filtered = [...products];

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(product => 
                product.category === categoryFilter
            );
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(filtered);
    }, [products, searchQuery, categoryFilter]);

    const getPageTitle = () => {
        if (categoryFilter) {
            return categoryFilter;
        }
        if (searchQuery) {
            return `Search Results for "${searchQuery}"`;
        }
        return "All Products";
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">{getPageTitle()}</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)
                    ) : (
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
        </>
    );
};

export default AllProducts;
