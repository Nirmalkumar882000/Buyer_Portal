import api from './axios';

export const fetchBuyerReports = async (filters: { startDate?: string, endDate?: string, saleType?: string, sellerId?: string, limit?: number, offset?: number }) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/buyer/reports', filters, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
