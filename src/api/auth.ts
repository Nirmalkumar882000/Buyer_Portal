import api from './axios';

export const getPlaces = async (lan: string = 'en') => {
    const response = await api.get('/places/places-list', { params: { lan } });
    return response.data;
}

// register , login , verifyotp 

export const registerApi = async (payload: any) => {
    const response = await api.post('/buyer/register', payload);
    return response.data;
}

export const verifyOtpApi = async (payload: { mobile_number: string; otp: string }) => {
    const response = await api.post('/buyer/verify-otp', payload);
    return response.data;
}

export const loginApi = async (payload: any) => {
    const response = await api.post('/buyer/login', payload);
    return response.data;
}

export const getProfileApi = async () => {
    const response = await api.get('/buyer/profile');
    return response.data;
}

export const updateProfileApi = async (payload: any) => {
    const response = await api.put('/buyer/update-profile', payload);
    return response.data;
}
