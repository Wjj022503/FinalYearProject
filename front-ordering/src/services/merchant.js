'use client'
import axios from "axios"

export async function addFood(foodData) {  
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food/add`, foodData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('merchant_access_token')}`
            },
        });
        return response.status;
    } catch (error) {
        if (error.response) {
            console.error('Add Food Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function getAllFoods(merchantID) {
    try {
        const body = {merchantID:merchantID}
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food/all`,body);
        return response.data;
    } catch (error) {
        console.error('Error fetching all foods:', error);
        throw error;
    }
}

export async function deleteFood(id) {
    try{
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${id}`);
        return response.status;
    }
    catch (error) {
        if (error.response) {
            console.error('Delete Food Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function updateFood(id, updatedData) {
    try {
        for (const [key, value] of Object.entries(updatedData)) {
            console.log(`${key}: ${value}`);
        }
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food/update/${id}`, updatedData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('merchant_access_token')}`
            },
        });
        return response.status;
    }
    catch (error) {
        if (error.response) {
            console.error('Update Food Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function updateStatus(id, status) {
    try {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/update-status/${id}`, {status:status} ,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('merchant_access_token')}`
            },
        });
        return response.status;
    }
    catch (error) {
        if (error.response) {
            console.error('Update Status Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function getFoodsByMerchant(merchantId) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food/merchant/${merchantId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching food by merchant ID:', error);
        throw error;
    }
}

export async function getAllOrders(merchantId) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/merchant/${merchantId}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('merchant_access_token')}`
            },
        });
        return response;
    }
    catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Session expired. Please log in again.');
            return error.response;
        }
        else if (error.response && error.response.status === 404) {
            console.error('No orders found for this merchant.');
            console.error('Error fetching orders:', error.response);
            return error.response;
        }
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function updateOrderStatus(orderId, status) {
    try {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/updateOrderStatus/${orderId}`, status,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('merchant_access_token')}`
            },        });
        return response.status;    } catch (error) {
        if (error.response) {
            console.error('Update Order Status Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
} 

export async function getOrderHistory(merchantId){
    try{
        const token = localStorage.getItem('merchant_access_token');
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/history/${merchantId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    }
    catch (error) {
        if (error.response) {
            console.error('Get Order History Error:', error.response);
            throw error.response;
        } else {
            console.error('Network error. Please try again.');
            throw error;
        }
    }    
}