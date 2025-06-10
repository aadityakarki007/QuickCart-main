"use client";
import React, { useState } from "react";
import { assets, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import { HomeIcon, ShoppingBag, Menu, BoxIcon, Phone, ChevronDown } from "lucide-react";



const Navbar = () => {
  const { isSeller, user } = useAppContext();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [router]);

  const categories = [
    "Motors, Tools & DIY",
    "Home & Lifestyle",
    "Sports & Outdoor",
    "Electronic & Accessories",
    "Groceries & Pets",
    "Men's Fashion",
    "Watches & Accessories",
    "Women's Fashion",
    "Health & Beauty",
    "Babies & Toys",
    "Clothing & Accessories",
    "Sports & Outdoor Play",
    "Gifts & Decorations",
    "Nursery",
    "Diapering & Potty",
    "Pacifiers & Accessories",
    "Feeding",
    "Remote Control & Vehicles",
    "Baby Gear",
    "Baby & Toddler Toys",
    "Toys & Games",
    "Baby Personal Care",
    "Soaps, Cleansers & Bodywash",
    "Baby Bath",
    "Bathing Tubs & Seats",
    "Cosmetics & Skin Care",
    "Exercise & Fitness"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleMobileNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (category) => {
    router.push(`/all-products?category=${encodeURIComponent(category)}`);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 sticky top-0 bg-white z-50">
      <div className="flex flex-col md:block w-full md:w-auto gap-3">
        <div className="flex items-center justify-between md:justify-start">
          <Image
            className="cursor-pointer w-28 md:w-32 hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
            src={assets.logo}
            alt="logo"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                {/* @ts-ignore */}
                <Menu className="w-6 h-6" />
              </button>
              {user ? (
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Cart"
                      labelIcon={<CartIcon />}
                      onClick={() => router.push("/cart")}
                    />
                    <UserButton.Action
                      label="My Orders"
                      labelIcon={<ShoppingBag />}
                      onClick={() => router.push("/my-orders")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                <button
                  onClick={(e) => { e.preventDefault(); openSignIn(); }}
                  className="flex items-center gap-2 hover:text-orange-500 hover:scale-105 transition-all duration-200"
                >
                  <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
                  Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleMobileNavigation("/")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <HomeIcon className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => handleMobileNavigation("/all-products")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <BoxIcon className="w-5 h-5" />
                All Products
              </button>
              
              {/* Category Dropdown for Mobile - Only show in hamburger menu if NOT on all-products page */}
              {currentPath !== '/all-products' && (
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:text-orange-600"
                  >
                    <div className="flex items-center gap-2">
                      <BoxIcon className="w-5 h-5" />
                      Categories
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="mt-2 ml-7 max-h-60 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleCategorySelect(category)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {user && (
                <>
                  <button
                    onClick={() => handleMobileNavigation("/cart")}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                  >
                    <div className="w-5 h-5">
                      <CartIcon />
                    </div>
                    Cart
                  </button>
                  <button
                    onClick={() => handleMobileNavigation("/my-orders")}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    My Orders
                  </button>
                </>
              )}
              {isSeller && (
                <button
                  onClick={() => handleMobileNavigation("/seller")}
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                >
                  <BoxIcon className="w-5 h-5" />
                  Seller Dashboard
                </button>
              )}
              {/* Add Contact Us button here */}
              <button
                onClick={() => handleMobileNavigation("/contact")}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <Phone className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>
        )}

        {/* Mobile Search Bar with Filter */}
        <div className="flex items-center gap-2 md:hidden w-full">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500 transition-colors pr-10"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-orange-500 transition-colors">
              <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
            </button>
          </form>

          {/* Category Filter - Show on Home page and All Products page */}
          {(currentPath === '/all-products' || currentPath === '/') && (
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors text-sm whitespace-nowrap"
              >
                <BoxIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 max-h-60 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                  <button
                    onClick={() => {
                      router.push('/all-products');
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100 font-medium"
                  >
                    All Categories
                  </button>
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>
        <Link href="/all-products" className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group">
          Shop
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>
        <Link
          href="/about-us"
          className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group"
        >
          About Us
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>

        <Link href="/contact" className="hover:text-orange-500 hover:scale-105 transition-all duration-200 relative group">
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-48 px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-orange-500 hover:border-gray-400 transition-all text-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-orange-500 transition-colors">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </form>
        <select
          onChange={(e) => {
            if (e.target.value) {
              router.push(`/all-products?category=${encodeURIComponent(e.target.value)}`);
            }
          }}
          className={`px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-gray-400 transition-all cursor-pointer ${currentPath !== '/all-products' ? 'hidden' : ''}`}
          defaultValue=""
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Home"
                labelIcon={<HomeIcon />}
                onClick={() => router.push("/")}
              />
              <UserButton.Action
                label="Products"
                labelIcon={<BoxIcon />}
                onClick={() => router.push("/all-products")}
              />

              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<ShoppingBag />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); openSignIn(); }}
            className="flex items-center gap-2 hover:text-orange-500 hover:scale-105 transition-all duration-200"
          >
            <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
            Account
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
