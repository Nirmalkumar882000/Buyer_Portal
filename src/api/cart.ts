import api from './axios';

export const getCart = async () => {
  const { data } = await api.get('/buyer/cart');
  return data?.data || data;
};

export const addToCart = async (product_id: number, agent_id: number, qty: number = 1) => {
  const { data } = await api.post('/buyer/cart', { product_id, agent_id, qty });
  return data?.data || data;
};

export const removeFromCart = async (cart_id: number) => {
  const { data } = await api.delete(`/buyer/cart/${cart_id}`);
  return data;
};
