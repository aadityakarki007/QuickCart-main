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

    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(query)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [products, searchQuery]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No products found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
