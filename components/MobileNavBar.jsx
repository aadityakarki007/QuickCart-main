'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiHome } from 'react-icons/hi';
import { BiCategory } from 'react-icons/bi';
import { BsCart3 } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';

const MobileNavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [showCategories, setShowCategories] = useState(false);

    const mainCategories = [
        "Men's Fashion",
        "Women's Fashion",
        "Electronic Devices",
        "Gifts & Decorations",
        "Home & Lifestyle",
        "Sports & Outdoor",
        "Health & Beauty",
        "Babies & Toys",
        "Motors, Tools & DIY",
        "Groceries & Pets"
    ];

    const navItems = [
        { name: 'Home', path: '/', icon: HiHome },
        { name: 'Cart', path: '/cart', icon: BsCart3 },
        { name: 'Account', path: '/account', icon: FaRegUser },
    ];

    const handleCategoryClick = () => {
        setShowCategories(!showCategories);
    };

    const handleCategorySelect = (category) => {
        router.push(`/all-products?category=${encodeURIComponent(category)}`);
        setShowCategories(false);
    };

    return (
        <>
            {showCategories && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCategories(false)}>
                    <div className="fixed bottom-16 left-0 right-0 bg-white p-4 max-h-[60vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Category</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {mainCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategorySelect(category)}
                                    className="p-3 text-left text-sm border rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <Link 
                            key={item.name}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full ${
                                pathname === item.path ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            <item.icon className={`text-2xl ${pathname === item.path ? 'text-orange-500' : 'text-gray-600'}`} />
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    ))}
                    <button
                        onClick={handleCategoryClick}
                        className={`flex flex-col items-center justify-center w-full h-full ${
                            showCategories ? 'text-orange-500' : 'text-gray-600'
                        }`}
                    >
                        <BiCategory className={`text-2xl ${showCategories ? 'text-orange-500' : 'text-gray-600'}`} />
                        <span className="text-xs mt-1">Categories</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default MobileNavBar;
