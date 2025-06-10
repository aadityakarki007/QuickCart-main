"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import QRCode from "qrcode";

const Product = () => {

    const { id } = useParams();

    const { products, router, user, getToken, cartItems, setCartItems } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [qrUrl, setQrUrl] = useState('');

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Item added to cart');
        if(user){ 
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
            } catch(error) {
                toast.error(error.message);
            }
        }
    };

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length]);

    useEffect(() => {
        if (productData?._id) {
            QRCode.toDataURL(`https://www.hamroeshop.com/product/${product._id}`)
                .then(url => setQrUrl(url))
                .catch(err => console.error('QR Code generation error:', err));
        }
    }, [productData?._id]);
    
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please log in to submit a review");
            return;
        }
        
        if (!reviewComment.trim()) {
            toast.error("Please enter a review comment");
            return;
        }
        
        try {
            setSubmittingReview(true);
            const token = await getToken();
            
            const response = await axios.post('/api/product/review', {
                productId: id,
                rating: reviewRating,
                comment: reviewComment,
                userName: user.firstName + ' ' + user.lastName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                toast.success("Review submitted successfully");
                setReviewComment('');
                setReviewRating(5);
                
                // Update the product data with the new review
                const updatedProduct = {...productData};
                updatedProduct.reviews = [...(updatedProduct.reviews || []), response.data.review];
                updatedProduct.averageRating = updatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / updatedProduct.reviews.length;
                setProductData(updatedProduct);
            } else {
                toast.error(response.data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            setSubmittingReview(false);
        }
    }

    if (!productData) {
        return <Loading />;
    }

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                {/* Main product section with image on left and details on right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - Product images */}
                    <div className="space-y-4">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 h-[400px]">
                            <Image
                                src={mainImage || (productData.images && productData.images.length > 0 ? productData.images[0] : assets.product_image1)}
                                alt={productData.name || 'Product image'}
                                className="w-full h-full object-contain mix-blend-multiply"
                                width={800}
                                height={800}
                            />
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            {productData.images && productData.images.length > 0 ? productData.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 ${mainImage === image ? 'border-orange-500' : 'border-transparent'}`}
                                    onClick={() => setMainImage(image)}
                                >
                                    <Image
                                        src={image}
                                        alt="alt"
                                        className="w-full h-auto object-cover mix-blend-multiply"
                                        width={100} 
                                        height={100} 
                                    />
                                </div>
                            )) : null}
                        </div>
                    </div>

                    {/* Right column - Product details */}
                    <div className="space-y-6">
                        {/* Product name and description */}
                        <div>
                            <h1 className="text-2xl font-medium mb-2">{productData.name}</h1>
                            <p className="text-gray-600 mb-4">{productData.description}</p>
                        </div>

                        {/* Ratings */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Image
                                        key={star}
                                        className="h-4 w-4"
                                        src={star <= (productData.averageRating || 0) ? assets.star_icon : assets.star_dull_icon}
                                        alt="star"
                                        width={16}
                                        height={16}
                                    />
                                ))}
                                <span className="ml-2 text-sm">{productData.averageRating?.toFixed(1) || 'No ratings'}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                ({productData.reviews?.length || 0} reviews)
                            </p>
                        </div>

                        {/* Price information */}
                        <div className="flex items-center gap-4">
                            <p className="text-2xl font-medium">Rs. {productData.offerPrice}</p>
                            <p className="text-gray-500 line-through">Rs. {productData.price}</p>
                            <p className="text-green-600 text-sm">
                                {Math.round(((productData.price - productData.offerPrice) / productData.price) * 100)}% off
                            </p>
                        </div>

                        {/* Product details in 2 columns */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Seller: {productData.sellerName || 'N/A'}</p>
                                <p className="text-blue-600">Delivery: {productData.deliveryDate || 'N/A'}</p>
                                <p className="text-gray-600">Brand: {productData.brand || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Color: {productData.color || 'N/A'}</p>
                                <p className="text-gray-600">Warranty: {productData.warrantyDuration || 'N/A'}</p>
                                <p className="text-gray-600">Return Period: {productData.returnPeriod || 'N/A'}</p>
                            </div>
                        </div>

                        {/* QR code */}
                        <div className="flex items-start gap-6 mt-4">
                            <div className="flex-shrink-0">
                                {qrUrl && (
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <Image 
                                            src={qrUrl} 
                                            alt="Product QR Code" 
                                            width={100} 
                                            height={100} 
                                            className="mix-blend-multiply"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                                onClick={() => addToCart(productData._id)}
                                className="w-full px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => { addToCart(productData._id); router.push('/cart') }}
                                className="w-full px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-slate-50 transition text-sm font-medium"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reviews Section */}
            <div className="w-full">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Customer <span className="font-medium text-orange-600">Reviews</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="mt-6 w-full">
                    {/* Review Form */}
                    <div className="mb-8 border p-6 rounded-lg">
                        <h3 className="text-xl font-medium mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Rating</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Image 
                                                className="h-6 w-6" 
                                                src={star <= Number(reviewRating) ? assets.star_icon : assets.star_dull_icon} 
                                                alt={`${star} star`} 
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-gray-600">{reviewRating} out of 5</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="review-comment" className="block text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    id="review-comment"
                                    rows={4}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Share your experience with this product..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                                disabled={submittingReview || !user}
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                            {!user && (
                                <p className="mt-2 text-sm text-gray-500">Please log in to submit a review</p>
                            )}
                        </form>
                    </div>
                    
                    {/* Reviews List */}
                    <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
                    {productData.reviews && productData.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {productData.reviews.map((review, index) => (
                                <div key={index} className="border p-4 rounded-lg">
                                    <p className="mt-2 text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
            <Footer />
        </>
    );
}

export default Product;
