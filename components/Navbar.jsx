"use client";
import React, { useState } from "react";
import { assets, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { HomeIcon, ShoppingBag } from "lucide-react";
import { BoxIcon } from "lucide-react";
import { useEffect } from "react";
const Navbar = () => {
  const { isSeller, user } = useAppContext();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <div className="flex flex-col md:block w-full md:w-auto gap-3">
        <div className="flex items-center justify-between md:justify-start">
          <Image
            className="cursor-pointer w-28 md:w-32"
            onClick={() => router.push("/")}
            src={assets.logo}
            alt="logo"
          />
          <div className="flex items-center gap-3 md:hidden">
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
                onClick={openSignIn}
                className="flex items-center gap-2 hover:text-gray-900 transition"
              >
                <Image src={assets.user_icon} alt="user icon" />
                Account
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSearch} className="relative md:hidden w-full">
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
      </div>

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-48 px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-orange-500 transition-colors text-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-orange-500 transition-colors">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </form>
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
    onClick={openSignIn}
    className="flex items-center gap-2 hover:text-gray-900 transition"
  >
    <Image src={assets.user_icon} alt="user icon" />
    Account
  </button>
)}

      </ul>
    </nav>
  );
};

export default Navbar;
