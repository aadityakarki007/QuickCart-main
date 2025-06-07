import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { router } = useAppContext();

    const handleClick = () => {
        router.push('/product/' + product._id);
        scrollTo(0, 0);
    };

    const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);

    return (
        <div 
            className="flex flex-col w-full cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            onClick={handleClick}
        >
            {/* Fixed aspect ratio container */}
            <div className="relative w-full pb-[100%] bg-gray-50 rounded-lg mb-3 overflow-hidden">
                <Image
                    src={product.images?.[0] || assets.product_image1}
                    alt={product.name}
                    className="object-contain hover:scale-105 transition duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    loading="lazy"
                />
            </div>

            <div className="space-y-2 flex-1">
                <div className="h-12">
                    <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-medium">Rs. {product.offerPrice.toLocaleString()}</span>
                    {product.price > product.offerPrice && (
                        <>
                            <span className="text-sm text-gray-500 line-through">Rs. {product.price.toLocaleString()}</span>
                            <span className="text-xs text-green-600">
                                {discount}% off
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
