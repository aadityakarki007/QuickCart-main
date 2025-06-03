'use client'

import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext({
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
  cartItems: [],
  setCartItems: (items) => {},
  products: [],
  setProducts: (products) => {},
  getCartCount: () => 0,
  getCartAmount: () => 0,
  getToken: async () => "",
});

export const useAppContext = () => {
    return useContext(AppContext);
}

    /**
     * Provider component for the AppContext.
     *
     * The AppContextProvider fetches product data and user data on mount.
     * It also provides functions to add and update items in the cart.
     * The context value includes the current cart, a function to set the cart,
     * a boolean indicating whether the user is a seller, a function to set that boolean,
     * a function to get the total number of items in the cart, and a function to get the total amount of the cart.
     * @param {{ children: React.ReactNode }} props
     * @returns {React.ReactElement} The AppContextProvider component.
     */
export const AppContextProvider = ({ children }) => {

    const { getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const currency = "NPR";
    const [loading, setLoading] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [userData, setUserData] = useState(null);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const fetchProductData = async () => {
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //this one
    const fetchUserData = async () => {
        try {

            if (user.publicMetadata.role === 'seller') {
                setIsSeller(true)
            }

            const token = await getToken()

            const {data} = await axios.get('/api/user/data',{ headers:{Authorization: `Bearer ${token}`}})

            if(data.success){
                setUserData(data.user)
                
                // Fetch cart items separately
                try {
                    const cartResponse = await axios.get('/api/cart/get', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    
                    if(cartResponse.data.success) {
                        setCartItems(cartResponse.data.cartItems || {})
                    }
                } catch (cartError) {
                    console.error("Error fetching cart:", cartError)
                    // Fallback to user's cart items if cart API fails
                    setCartItems(data.user.cartItems || {})
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
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
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
        if(user){ 
            try {
                const token = await getToken()
                
                await axios.post('/api/cart/update',{cartData},{headers:{Authorization: `Bearer ${token}`}})

                toast.success('Cart updated')
                
            } catch(error){
                toast.error(error.message)
            }
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
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const value = {
        cart: cartItems,
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
        getCartCount: () => cartItems.reduce((a, b) => a + (b.quantity || 0), 0),
        getCartAmount: () => cartItems.reduce((total, item) => {
            const product = products.find(p => p._id === item.productId);
            return total + (product ? product.price * (item.quantity || 0) : 0);
        }, 0),
        getToken
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
