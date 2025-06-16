'use client';
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation';

const AllProducts = () => {
    const { products } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20); // default to desktop

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';

    // Update products per page based on screen size
    useEffect(() => {
        const updateProductsPerPage = () => {
            const isMobile = window.innerWidth < 768;
            setProductsPerPage(isMobile ? 14 : 20); // 14 for mobile, 20 for desktop
        };

        updateProductsPerPage();
        window.addEventListener('resize', updateProductsPerPage);

        return () => window.removeEventListener('resize', updateProductsPerPage);
    }, []);

    // Filter products based on search and category
    useEffect(() => {
        let filtered = [...products];

        if (categoryFilter) {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, searchQuery, categoryFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    const getPageTitle = () => {
        if (categoryFilter) return categoryFilter;
        if (searchQuery) return `Search Results for "${searchQuery}"`;
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

                {/* Mobile Product Grid - 2 columns with custom pricing */}
                <div className="md:hidden grid grid-cols-2 gap-2 mt-8 w-full pb-10">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => {
                            const price = product.offerPrice || product.price;
                            const original = product.price;
                            const hasDiscount = product.price && product.offerPrice && product.price > product.offerPrice;
                            const discount = hasDiscount
                                ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                                : 0;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden cursor-pointer"
                                    onClick={() => window.location.href = `/product/${product._id}`}
                                >
                                    {/* Square Product Image */}
                                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={product.images?.[0] || '/placeholder-image.jpg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Product Info */}
                                    <div className="p-2">
                                        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 h-8">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-x-4 mb-1">
                                            <span className="text-base font-bold text-orange-600">
                                                Rs.{price}
                                            </span>
                                            {hasDiscount && (
                                                <>
                                                    <span className="text-xs text-gray-500 line-through">
                                                        Rs.{product.price}
                                                    </span>
                                                    <span className="text-xs text-green-600 font-semibold ml-2">
                                                        -{discount}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {/* Category */}
                                        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                                        {/* Ratings */}
                                        {product.rating && (
                                            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                                                <span>★</span>
                                                <span>{product.rating}</span>
                                            </div>
                                        )}
                                        {/* Sold Count */}
                                        {product.soldCount && (
                                            <div className="text-xs text-gray-400">{product.soldCount} sold</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                            {categoryFilter ? 
                                `No products found in category "${categoryFilter}"` :
                                searchQuery ? 
                                    `No products found matching "${searchQuery}"` :
                                    "No products available"
                            }
                        </div>
                    )}
                </div>

                {/* Desktop Product Grid - Uses ProductCard component */}
                <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 w-full pb-10">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4 mb-10 w-full">
                        <button
                            className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;