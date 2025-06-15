import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 md:py-0 py-8 bg-[#E6E9F2] md:my-16 my-8 rounded-xl overflow-hidden">
      <Image
        className="md:max-w-56 max-w-40"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
      />
      <div className="flex flex-col items-center justify-center text-center md:space-y-2 space-y-1 md:px-0 px-2">
        <h2 className="md:text-2xl md:md:text-3xl text-lg font-semibold md:max-w-[290px] max-w-[250px]">
          Level Up Your Gaming Experience
        </h2>
        <p className="md:max-w-[343px] max-w-[280px] md:font-medium font-normal md:text-base text-sm text-gray-800/60">
          From immersive sound to precise controls—everything you need to win
        </p>
        <button className="group flex items-center justify-center gap-1 md:px-12 md:py-2.5 px-8 py-2 bg-orange-600 rounded text-white md:text-base text-sm">
          Buy now
          <Image className="group-hover:translate-x-1 transition md:w-auto w-3" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={assets.md_controller_image}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden max-w-32"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
      />
    </div>
  );
};

export default Banner;