'use client'

import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

/** @type {import('react').Context<AppContextType>} */
export const AppContext = createContext(/** @type {AppContextType} */ ({
  cart: [],
  setCart: (cart) => {},
  loading: false,
  setLoading: (loading) => {},
  user: null,
  setUser: (user) => {},
  currency: "",
  router: null,
  isSeller: false,
  setIsSeller: (isSeller) => {},
  cartItems: {},
  setCartItems: (items) => {},
  products: [],
  setProducts: (products) => {},
  popularProducts: [],
  setPopularProducts: (products) => {},
  getCartCount: () => 0,
  getCartAmount: () => 0,
  getToken: async () => "",
}));

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = ({ children }) => {
    const { getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const currency = "NPR";
    const [loading, setLoading] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [userData, setUserData] = useState(null);
    const [products, setProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [isAdmin , setIsAdmin] = useState(false); 

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPopularProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/popular');
            if (data.success) {
                setPopularProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching popular products:', error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const fetchUserData = async () => {
        try {
            setLoading(true);
            let token;
            if (user) {
                try {
                    token = await getToken();
                } catch (tokenError) {
                    console.error('Error getting Clerk token:', tokenError);
                }
            }
            if (!token && user?.id) {
                token = user.id;
            }
            if (!token) {
                return;
            }
            if (user?.publicMetadata.role === 'seller') {
                setIsSeller(true);
            }
            if (user?.publicMetadata.role === 'admin') {
                setIsSeller(true);
                setIsAdmin(true); 
            }
            const { data } = await axios.get('/api/user/data', { 
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setUserData(data.user);
                try {
                    const cartResponse = await axios.get('/api/cart/get', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (cartResponse.data.success) {
                        setCartItems(cartResponse.data.cartItems || {});
                    }
                } catch (cartError) {
                    setCartItems(data.user.cartItems || {});
                } finally {
                    setLoading(false);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Item added to cart')
        if(user){ 
            try {
                const token = await getToken()
                await axios.post('/api/cart/update',{cartData},{headers:{Authorization: `Bearer ${token}`}})
                toast.success('Item added to cart')
            } catch(error){
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {
        try {
            const product = products.find(p => p._id === itemId);
            if (!product) {
                toast.error('Product not found');
                return;
            }
            if (quantity > product.stock) {
                toast.error(`Only ${product.stock} items available in stock`);
                quantity = product.stock;
            }
            let cartData = {...cartItems};
            if (quantity <= 0) {
                delete cartData[itemId];
                toast.success('Item removed from cart');
            } else {
                cartData[itemId] = Number(quantity);
            }
            setCartItems(cartData);
            if(user){ 
                try {
                    const token = await getToken();
                    const response = await axios.post('/api/cart/update', 
                        {cartData}, 
                        {headers: {Authorization: `Bearer ${token}`}}
                    );
                    if (!response.data.success) {
                        toast.error('Failed to sync cart with server');
                    }
                } catch(error) {
                    toast.error(error.message || 'Error updating cart');
                }
            }
        } catch (error) {
            toast.error('Failed to update cart');
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                totalCount += cartItems[itemId];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData();
        fetchPopularProducts();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    /** @type {AppContextType} */
    const value = {
        cart: Object.values(cartItems),
        setCart: setCartItems,
        loading,
        setLoading,
        user,
        setUser: () => {},
        currency,
        router,
        isSeller,
        setIsSeller,
        cartItems,
        setCartItems,
        products,
        setProducts,
        popularProducts,
        setPopularProducts,
        getCartCount,
        getCartAmount,
        getToken,
        addToCart,
        updateCartQuantity
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
