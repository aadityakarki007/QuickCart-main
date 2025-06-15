import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext()
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        if (product._id) {
            QRCode.toDataURL(`https://www.hamroeshop.com/product/${product._id}`)

                .then(url => setQrUrl(url))
                .catch(err => console.error('QR Code generation error:', err));
        }
    }, [product._id]);

    return (
        <div 
            className="flex flex-col w-full cursor-pointer border border-gray-200 rounded-lg md:p-4 p-2 hover:shadow-md transition-shadow"
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
        >
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg md:mb-3 mb-2 overflow-hidden">
                <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : assets.product_image1}
                    alt={product.name}
                    className="object-contain hover:scale-105 transition duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="md:space-y-2 space-y-1">
                <div className="md:h-12 h-10">
                    <h3 className="md:text-sm text-xs font-medium line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="md:text-lg text-sm font-medium">Rs. {product.offerPrice}</span>
                    <span className="md:text-sm text-xs text-gray-500 line-through">Rs. {product.price}</span>
                    <span className="text-xs text-green-600">
                        {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% off
                    </span>
                </div>
            </div>
        </div>
    )
}
export default ProductCard;