'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {

    const { currency, getToken, user} = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {

            const token = await getToken();
            
            const {data} = await axios.get('/api/order/list', {headers:{Authorization: `Bearer ${token}`}})

            if (data.success) {
                setOrders(data.orders.reverse())
                setLoading(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(user){
            fetchOrders();
        }
    }, [user]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (<div className="max-w-5xl border-t border-gray-300 text-sm">
                        {orders.map((order, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    {/* Show the first product's image if available, fallback to box_icon */}
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={
                                            order.items[0]?.product && order.items[0].product.images && order.items[0].product.images.length > 0
                                                ? order.items[0].product.images[0]
                                                : assets.box_icon
                                        }
                                        alt={order.items[0]?.product?.name || "Product image"}
                                        width={64}
                                        height={64}
                                    />
                                    <div className="flex flex-col gap-3">
                                      <div className="font-medium text-base">
                                        {order.items.map((item, idx) => (
                                          <span key={idx} className="inline-flex items-center mr-2">
                                            {item.product ? (
                                              <>
                                                {item.product.name} x {item.quantity}
                                                {item.color && (
                                                  <span
                                                    className="ml-2 text-xs px-2 py-1 rounded-full border bg-gray-100"
                                                    style={{
                                                      color: item.color.toLowerCase(),
                                                      borderColor: item.color,
                                                    }}
                                                  >
                                                    {item.color}
                                                  </span>
                                                )}
                                              </>
                                            ) : (
                                              <>Unknown Product x {item.quantity}</>
                                            )}
                                            {idx < order.items.length - 1 && <span>, </span>}
                                          </span>
                                        ))}
                                      </div>
                                      <span>Items : {order.items.length}</span>
                                    </div>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-medium">{order.address.fullName}</span>
                                        <br />
                                        <span >{order.address.area}</span>
                                        <br />
                                        <span>{`${order.address.city}, ${order.address.province}`}</span>
                                        <br />
                                        <span>{order.address.PhoneNumber}</span>
                                        {order.promoCode && (
                                          <>
                                            <br />
                                            <span className="text-xs text-green-600 font-semibold">
                                              Promo Code: {order.promoCode}
                                            </span>
                                          </>
                                        )}
                                    </p>
                                </div>
                                <p className="font-medium my-auto">{currency}{order.totalAmount}</p>
                                <div>
                                    <p className="flex flex-col">
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;
