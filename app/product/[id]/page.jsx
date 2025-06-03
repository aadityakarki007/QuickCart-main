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

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart, user, getToken } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])
    
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

    return productData ? (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || (productData.images && productData.images.length > 0 ? productData.images[0] : assets.product_image1)}
                            alt={productData.name || 'Product image'}
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.images && productData.images.length > 0 ? productData.images.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        )) : null}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image 
                                    key={star}
                                    className="h-4 w-4" 
                                    src={star <= (productData.averageRating || 0) ? assets.star_icon : assets.star_dull_icon} 
                                    alt={star <= (productData.averageRating || 0) ? "star_icon" : "star_dull_icon"} 
                                />
                            ))}
                        </div>
                        <p>({productData.averageRating || 0})</p>
                    </div>
                    {productData.sellerName && (
                        <p className="text-gray-700 mt-2">
                            <span className="font-medium">Seller:</span> {productData.sellerName}
                        </p>
                    )}
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        Rs. {productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            Rs. {productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Generic</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Shipping Fee</td>
                                    <td className="text-gray-800/50 ">Rs. {productData.shippingFee || 0}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Delivery Charge</td>
                                    <td className="text-gray-800/50 ">Rs. {productData.deliveryCharge || 0}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">Multi</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={() => addToCart(productData._id)} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(productData._id); router.push('/cart') }} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                            Buy now
                        </button>
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
                                                src={star <= reviewRating ? assets.star_icon : assets.star_dull_icon} 
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
                                    rows="4"
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
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{review.userName}</h3>
                                            <div className="flex items-center gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Image 
                                                        key={star}
                                                        className="h-3 w-3" 
                                                        src={star <= review.rating ? assets.star_icon : assets.star_dull_icon} 
                                                        alt="star" 
                                                    />
                                                ))}
                                                <span className="text-sm text-gray-500 ml-2">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
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
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;