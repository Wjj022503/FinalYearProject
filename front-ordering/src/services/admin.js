'use client'
import axios from "axios"

export async function addMerchant(merchantData) {
    try {
        const token = localStorage.getItem('admin_access_token');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/add`, merchantData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.status;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                console.error('Email has already been registered');
                return 403;
            }
            console.error('Add Merchant Error:', error.response);
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function getMerchants() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching merchants:', error);
        throw error;
    }
}

export async function deleteMerchant(merchantId) {
    try {
        const token = localStorage.getItem('admin_access_token');
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/${merchantId}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error deleting merchant:', error);
        throw error;
    }
}

export async function getMerchantById(merchantId) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/${merchantId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching merchant by ID:', error);
        throw error;
    }
}

export async function updateMerchant(merchantId, updatedData) {
    try {
        const token = localStorage.getItem('admin_access_token');
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/${merchantId}`, updatedData,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.status;
    }
    catch (error) {
        console.error('Error updating merchant:', error);
        throw error;
    }
}