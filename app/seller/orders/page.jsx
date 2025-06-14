'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchSellerOrders = async () => {
        try{
            console.log("🔍 Fetching seller orders...");
            console.log("👤 User:", user);

            const token = await getToken();
            console.log("🔑 Token:", token ? "Token exists" : "No token");

            const {data} = await axios.get('/api/order/seller-orders', {
                headers:{Authorization: `Bearer ${token}`}
            });

            console.log("📦 API Response:", data);

            if(data.success){
                console.log("✅ Orders fetched successfully:", data.orders);
                console.log("📊 Number of orders:", data.orders?.length || 0);
                setOrders(data.orders || []);
                setFilteredOrders(data.orders || []);
                setLoading(false);
            } else {
                console.error("❌ API Error:", data.message);
                toast.error(data.message);
                setLoading(false);
            }

        } catch(error){
            console.error("💥 Fetch Error:", error);
            console.error("Error details:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("🔄 useEffect triggered, user:", user);
        if(user){
            fetchSellerOrders();
        } else {
            console.log("⏳ Waiting for user...");
        }
    }, [user]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredOrders(orders);
            return;
        }

        const searchTerm = query.toLowerCase();
        const filtered = orders.filter(order => {
            // Search by customer name
            const customerName = order.address?.fullName?.toLowerCase() || '';
            if (customerName.includes(searchTerm)) return true;

            // Search by product names
            const productNames = order.items?.map(item => item.product?.name?.toLowerCase()) || [];
            if (productNames.some(name => name && name.includes(searchTerm))) return true;

            // Search by date
            const orderDate = new Date(order.date).toLocaleDateString().toLowerCase();
            if (orderDate.includes(searchTerm)) return true;

            // Search by amount
            const amount = order.amount?.toString() || '';
            if (amount.includes(searchTerm)) return true;

            return false;
        });

        setFilteredOrders(filtered);
    };

    // Debug render
    console.log("🎨 Rendering component:");
    console.log("- Loading:", loading);
    console.log("- Orders count:", orders.length);
    console.log("- Filtered orders count:", filteredOrders.length);
    console.log("- User exists:", !!user);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-medium">Orders ({filteredOrders.length})</h2>
                    <div className="w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by customer name, product, date, or amount..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                </div>
                
                {/* Debug info */}
                <div className="bg-gray-100 p-4 rounded-lg text-xs">
                    <p><strong>Debug Info:</strong></p>
                    <p>Total orders: {orders.length}</p>
                    <p>Filtered orders: {filteredOrders.length}</p>
                    <p>User ID: {user?._id || 'No user'}</p>
                    <p>Search query: "{searchQuery}"</p>
                </div>

                <div className="max-w-4xl rounded-md">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                {orders.length === 0 
                                    ? "No orders found. Check console for debugging info." 
                                    : "No orders match your search criteria."
                                }
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map((order, index) => (
                            <div key={order._id || index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={
                                            order.items?.[0]?.product?.images?.[0]
                                                ? order.items[0].product.images[0]
                                                : assets.box_icon
                                        }
                                        alt={order.items?.[0]?.product?.name || "Product image"}
                                        width={64}
                                        height={64}
                                    />
                                    <div className="flex flex-col gap-3">
                                        <span className="font-medium">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.product?.name || 'Unknown Product'} x {item.quantity || 0}
                                                    {item.color && (
                                                        <span className="ml-2 text-xs px-2 py-1 rounded-full border bg-gray-100" style={{ color: item.color.toLowerCase(), borderColor: item.color }}>
                                                            {item.color}
                                                        </span>
                                                    )}
                                                </div>
                                            )).reduce((prev, curr) => [prev, ', ', curr])}
                                        </span>
                                        <span>Items : {order.items?.length || 0}</span>
                                    </div>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-medium">{order.address?.fullName || 'N/A'}</span>
                                        <br />
                                        <span>{order.address?.area || 'N/A'}</span>
                                        <br />
                                        <span>{order.address?.city ? `${order.address.city}, ${order.address.province}` : 'N/A'}</span>
                                        <br />
                                        <span>{order.address?.PhoneNumber || 'N/A'}</span>
                                    </p>
                                </div>
                                <p className="font-medium my-auto">{currency}{order.amount || 0}</p>
                                <div>
                                    <p className="flex flex-col">
                                        <span>Method : COD</span>
                                        <span>Date : {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                                        <span>Payment : Pending</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;