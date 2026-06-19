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
