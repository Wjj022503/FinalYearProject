'use client'
import axios from "axios"

export async function getAvailableMerchants() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/available`);
        return response.data;
    } catch (error) {
        console.error('Error fetching merchants:', error);
        throw error;
    }
}

export async function getAvailableFoods(merchantId){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/food/available/${merchantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching foods:', error);
        throw error;
    }
}

export async function getCart(userId) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/current`, {
            headers: {
                Authorization: `Bearer ${token}`,
                userID: userId,
            },
        });
        return response.data.cartID ;
    } catch (error) {
        if (!error.response) {
            return 503;
        }
        console.error('Error fetching cart:', error);
        throw error;
    }
}

export async function addToCartDb(userId, foodData) {
    const cleanedFoodData = {
        foodId: foodData.id,
        foodName: foodData.name,
        quantity: 1,
        priceAtTime: foodData.price,
        image: foodData.image
    };

    const token = localStorage.getItem('access_token');
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add/${userId}`, cleanedFoodData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    }
    catch (error) {
        if (error.response) {
            console.error('Add to Cart Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function getCartItems(userId) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/all/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
}

export async function removeFromCart(cartItemId) {
    try {
        console.log("Removing item with ID:", cartItemId);
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/delete/${cartItemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
    }
}

export async function removeAllFromCart(cartId) {
    try {
        console.log("Removing all items from cart with ID:", cartId);
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/all/${cartId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error removing all items from cart:', error);
        throw error;
    }
}

export async function updateCart(cartItemId, cartId, quantity) {
    try {
        console.log("Updating cart item with ID:", cartItemId, "CartId:", cartId,"to quantity:", quantity);
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/update/${cartItemId}`, { cartId, quantity }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
}

export async function createOrder(cartId, userId) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/create/${cartId}`, { userId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function getCustomerOrders(userId) {
    try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/customer/${userId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error('Error fetching orders:', err);
        throw err;
    }
}

export async function getMerchantByFoodId(foodId) {
    try {
        console.log("Fetching merchant by food ID:", foodId);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/food/${foodId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching merchant by food ID:', error);
        throw error;
    }
}

export async function changePassword(userId, newPassword) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, { userId, newPassword }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}