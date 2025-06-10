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

const Home = () => {
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
            Spin the wheel of savings and reveal a unique discount just for you!
          </p>
          <div className="mt-6">
            <Link href="/trypromo">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out">
                🎲 Try
              </button>
            </Link>
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
