import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: assets.girl_with_headphone_image,
    title: "Unparalleled Sound",
    description: "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.girl_with_earphone_image,
    title: "Stay Connected",
    description: "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-3 gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">{description}</p>
              <a href="https://www.hamroeshop.com/all-products?search=headphones" target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                  Buy now{" "}
                  <Image
                    className="h-3 w-3"
                    src={assets.redirect_icon}
                    alt="Redirect Icon"
                  />
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden mt-12 px-4 flex flex-col items-center gap-6">
        {/* Top row: two products */}
        <div className="flex w-full gap-4">
          {[0, 1].map((i) => {
            const { id, image, title, description } = products[i];
            return (
              <div
                key={id}
                className="relative group flex-1 max-w-[48%] scale-90"
              >
                <Image
                  src={image}
                  alt={title}
                  className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
                />
                <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-6 left-4 text-white space-y-1.5">
                  <p className="font-medium text-lg">{title}</p>
                  <p className="text-xs leading-4 max-w-[90%]">{description}</p>
                  <a href="https://www.hamroeshop.com/all-products?search=headphones" target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-1 bg-orange-600 px-3 py-1.5 rounded text-sm">
                      Buy now{" "}
                      <Image
                        className="h-3 w-3"
                        src={assets.redirect_icon}
                        alt="Redirect Icon"
                      />
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom row */}
        <div className="relative group max-w-[60%] scale-90">
          <Image
            src={products[2].image}
            alt={products[2].title}
            className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
          />
          <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-6 left-4 text-white space-y-1.5">
            <p className="font-medium text-lg">{products[2].title}</p>
            <p className="text-xs leading-4 max-w-[90%]">{products[2].description}</p>
            <a href="https://www.hamroeshop.com/all-products?search=headphones" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-1 bg-orange-600 px-3 py-1.5 rounded text-sm">
                Buy now{" "}
                <Image
                  className="h-3 w-3"
                  src={assets.redirect_icon}
                  alt="Redirect Icon"
                />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
