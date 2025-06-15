import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      mobileTitle: "Perfect Headphones!",
      offer: "Limited Time Offer 6% Off",
      mobileOffer: "6% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
      link: "https://www.hamroeshop.com/product/6847e56f94e24a6b4981a855",
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      mobileTitle: "PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      mobileOffer: "Few left!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
      link: "https://www.hamroeshop.com/product/684acf35a9eca259d9bc91c3",
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      mobileTitle: "MacBook Pro Here!",
      offer: "Exclusive Deal 40% Off",
      mobileOffer: "40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
      link: "/products",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
                      <div
            key={slide.id}
            className="flex flex-row items-center justify-between bg-[#E6E9F2] py-3 md:py-8 md:px-14 px-4 mt-6 rounded-xl min-w-full md:min-h-0 min-h-[140px]"
          >
            {/* Mobile Layout - Side by side with shorter content */}
            <div className="md:pl-8 flex-1 md:mt-0">
              <p className="md:text-base text-xs text-orange-600 pb-1">
                <span className="md:hidden">{slide.mobileOffer}</span>
                <span className="hidden md:block">{slide.offer}</span>
              </p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-sm leading-4 font-semibold">
                <span className="md:hidden">{slide.mobileTitle}</span>
                <span className="hidden md:block">{slide.title}</span>
              </h1>
              <div className="flex flex-col md:flex-row items-start md:items-center mt-2 md:mt-6 gap-1 md:gap-0">
                {slide.link.startsWith("http") ? (
                  <a
                    href={slide.link}
                    className="md:px-10 px-3 md:py-2.5 py-1 bg-orange-600 rounded-full text-white font-medium text-xs md:text-base"
                  >
                    {slide.buttonText1}
                  </a>
                ) : (
                  <Link href={slide.link}>
                    <button className="md:px-10 px-3 md:py-2.5 py-1 bg-orange-600 rounded-full text-white font-medium text-xs md:text-base">
                      {slide.buttonText1}
                    </button>
                  </Link>
                )}
                <Link href="/all-products">
                  <button className="group flex items-center gap-1 md:gap-2 px-2 md:px-6 py-1 md:py-2.5 font-medium text-xs md:text-base">
                    {slide.buttonText2}
                    <Image className="group-hover:translate-x-1 transition w-2 h-2 md:w-4 md:h-4" src={assets.arrow_icon} alt="arrow_icon" />
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Image container - much smaller on mobile, same on desktop */}
            <div className="flex items-center justify-center flex-shrink-0">
              <Image
                className="md:w-72 w-20 h-auto object-contain"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;