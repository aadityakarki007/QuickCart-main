import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
const codImg = "/cod.jpg";


const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
    products,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(0);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      image: "/cod.jpg", // Correct for public folder
    },
  ];
  
  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch addresses.");
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const calculateFees = () => {
    if (!products || !cartItems) return;

    let shippingFee = 0;
    let deliveryCharge = 0;

    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      if (product) {
        shippingFee += (product.shippingFee || 0) * quantity;
        deliveryCharge += (product.deliveryCharge || 0) * quantity;
      }
    });

    setTotalShippingFee(shippingFee);
    setTotalDeliveryCharge(deliveryCharge);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) return toast.error("Please select an address");
      if (!selectedPaymentMethod) return toast.error("Please select a payment method");

      let cartItemsArray = [];

      if (cartItems && typeof cartItems === "object") {
        cartItemsArray = Object.entries(cartItems)
          .map(([id, quantity]) => ({
            product: id,
            quantity: Number(quantity),
          }))
          .filter((item) => item.quantity > 0);
      }

      if (cartItemsArray.length === 0) {
        return toast.error("Your cart is empty");
      }

      const token = await getToken();

      const response = await axios.post(
        "/api/order/create",
        {
          address: selectedAddress,
          items: cartItemsArray,
          paymentMethod: selectedPaymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Failed to create order");
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  useEffect(() => {
    calculateFees();
  }, [products, cartItems]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        {/* Address Selection */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative w-full text-sm border bg-white">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="peer w-full text-left px-4 pr-10 py-2 text-gray-700 focus:outline-none"
            >
              {selectedAddress
                ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.province}`
                : "Select Address"}

              <svg
                className={`w-5 h-5 absolute right-3 top-3 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-y-auto">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.province}
                  </li>
                ))}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center text-orange-600"
                  onClick={() => router.push("/add-address")}
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="w-full p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Payment Method */}
        {/* Payment Method */}
<div>
  <label className="text-base font-medium uppercase text-gray-600 block mb-3">
    Payment Method
  </label>
  <p className="text-gray-700">Cash on Delivery</p>
</div>

        {/* Price Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">Rs. {getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Rs. {totalShippingFee}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Delivery Charge</p>
            <p className="font-medium text-gray-800">Rs. {totalDeliveryCharge}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>Rs. {getCartAmount() + totalShippingFee + totalDeliveryCharge}</p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
