'use client';
import React from "react";
import Link from "next/link";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNavBar from "@/components/MobileNavBar";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Home = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleTryClick = () => {
    if (!isLoaded) return; // Wait for Clerk to load
    if (!user) {
      // Redirect to sign-in and then to /trypromo after login
      router.push('/sign-in?redirect_url=/trypromo');
    } else {
      router.push('/trypromo');
    }
  };

  return (
    <div className="relative pb-16">
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        
        {/* Try Your Luck Section */}
        <div className="text-center py-12 my-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            ✨ Unlock Your Special Promo Code Today ✨
          </h2>
          <p className="text-gray-600 mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Choose any number from 1 to 100 and unlock a special promo code made just for you!
          </p>
          <div className="mt-6">
            <button
              onClick={handleTryClick}
              disabled={!isLoaded}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {!isLoaded ? '⏳ Loading...' : '🎲 Try Your Luck'}
            </button>
          </div>
        </div>
        
        <NewsLetter />
      </div>

      <Footer />
      <MobileNavBar />
    </div>
  );
};

export default Home;