'use client';
import axios from 'axios';
// Allow cookies
axios.defaults.withCredentials = true;

export async function signup(userData) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
            email: userData.email,
            password: userData.password,
            UserName: userData.name,
        });
        return response.status;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                console.error('Email has already been registered');  // Added for debugging
                return 403;
            }
            console.error('Signup Error:', error.response);  // Now it shows properly in console
            return error.response.status;
        } else {
            console.error('Network error. Please try again.');
            return 503;
        }
    }
}

export async function login(userData) {
    try{ 
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
            email: userData.email,
            password: userData.password,
          });
        localStorage.setItem('access_token', response.data.access_token);
        return response.status;
    }
    catch (error) {
        if (error.response) {
            console.error('Login Error:', error.response);
            return error.response.status
        } 
        else {
            console.log('Network error. Please try again.');
            return 503;
        }
    }
}

export async function merchant_login(userData) {
    try{ 
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/merchant/login`, {
            email: userData.email,
            password: userData.password,
          });
        localStorage.setItem('merchant_access_token', response.data.merchant_access_token);
        return response.status;
    }
    catch (error) {
        if (error.response) {
            console.error('Login Error:', error.response);
            return error.response.status
        } 
        else {
            console.log('Network error. Please try again.');
            return 503;
        }
    }
}

export async function admin_login(userData) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/admin/login`, {
            email: userData.email,
            password: userData.password,
        });
        localStorage.setItem('admin_access_token', response.data.admin_access_token);
        return response.status; 
    } catch (error) {
        if (error.response) {
            console.error('Login Error:', error.response);
            return error.response.status
        } else {
            console.log('Network error. Please try again.');
            return 503;
        }
    }
}

export async function refreshAccessToken() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh/customer`,{
                withCredentials: true,
        });
        const newAccessToken = response.data.access_token;

        localStorage.setItem('access_token', newAccessToken);
        return true;
    } catch (error) {
        console.error('Refresh Error:', error);
        return false;
    }
}

export async function refreshMerchantAccessToken() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh/merchant`, {
                withCredentials: true,
        });
        const newAccessToken = response.data.access_token;
        console.log('New Merchant Access Token:', newAccessToken);

        localStorage.setItem('merchant_access_token', newAccessToken);
        return true;
    } catch (error) {
        console.error('--------------Refresh Error-----------------\n', error);
        return false;
    }
}

export async function getMe() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/customer/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export async function getMerchantMe() {
    try {
        const token = localStorage.getItem('merchant_access_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/merchant/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = response.data;
        const data = {merchantName: res.merchantName, merchantID: res.id};
        return data;
    }
    catch (error) {
        console.error('Error fetching merchant data:', error);
        throw error;
    }
}

export async function getAdminMe() {
    try {
        const token = localStorage.getItem('admin_access_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/admin/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin data:', error);
        throw error;
    }
}