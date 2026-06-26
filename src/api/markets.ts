import api from './axios';

export interface MarketFilters {
  district?: string;
  state?: string;
  product?: string;
  searchString?: string;
}

export interface AgentMarketResponse {
  success: boolean;
  data: {
    district: string;
    state: string;
    agent_list: any[];
    active_lots: number;
    product_list: any[];
    total_agents: number;
    products: string[];
  }[];
}

export const getAgentMarkets = async (filters: MarketFilters): Promise<AgentMarketResponse> => {
  const { data } = await api.get('/buyer/agent-markets', { params: filters });
  if (data?.data?.data && Array.isArray(data.data.data)) {
    return data.data;
  }
  return data;
};

export const getDistrictAgents = async (district: string, searchString?: string, product?: string) => {
  const { data } = await api.get('/buyer/district-agents', { 
    params: { district, searchString, product } 
  });
  if (data?.data?.data && Array.isArray(data.data.data)) {
    return data.data;
  }
  return data;
};

export const getAgentProfile = async (agentId: string | number, lan?: string) => {
  const { data } = await api.get('/buyer/agent-profile', {
    params: { agent_id: agentId, lan }
  });
  if (data?.data) {
    return data.data;
  }
  return data;
};

export const sendRegistrationRequest = async (params: {
  agent_id: string | number;
  buyer_name: string;
  business_name: string;
  mobile: string;
  commodities?: string;
  message?: string;
}) => {
  const { data } = await api.post('/buyer/register-request', params);
  return data;
};

export const getRegistrationStatus = async (agentId: string | number) => {
  const { data } = await api.get('/buyer/registration-status', {
    params: { agent_id: agentId }
  });
  return data?.data?.data !== undefined ? data.data.data : (data?.data || null);
};

export const getBuyerNotifications = async () => {
  const { data } = await api.get('/notification');
  return data?.data?.data || data?.data || [];
};

export const markNotificationsRead = async () => {
  const { data } = await api.post('/notification/read-all');
  return data?.success || false;
};

export const getBuyerProfile = async () => {
  const { data } = await api.get('/buyer/profile');
  return data?.data?.user || data?.user || null;
};

export const getMyAgents = async () => {
  const { data } = await api.get('/buyer/my-agents');
  return data?.data?.data !== undefined ? data.data.data : (data?.data || []);
};

export const withdrawRegistrationRequest = async (agentId: string | number) => {
  const { data } = await api.post('/buyer/withdraw-request', { agent_id: agentId });
  return data;
};

export const getBuyerAgentProducts = async (params: {
  status: string;
  sales_type?: string;
  searchString?: string;
  agentname?: string;
  productname?: string;
}) => {
  const { data } = await api.post('/buyer/agent-products', params);
  return data?.data || data;
};

export const setBuyerReminder = async (lotId: number | string) => {
  const { data } = await api.post('/buyer/set-reminder', { lot_id: lotId });
  return data;
};

