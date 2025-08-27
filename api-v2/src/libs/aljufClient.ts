import axios from 'axios';
const headers = {
  'API-Key': process.env.ALJUF_API_KEY,
  'Content-Type': 'application/json',
};

export const AljufClient = {
  async createLead(payload: any) {
    return axios.post(`${process.env.ALJUF_BASE_URL}/LeadManagement`, payload, { headers });
  },

  async updateLead(payload: any) {
    return axios.post(`${process.env.ALJUF_BASE_URL}/UpdateLeadManagement`, payload, { headers });
  },

  async getLeadStatus(refNo: string) {
    return axios.get(`${process.env.ALJUF_BASE_URL}/GetLeadStatus`, {
      headers,
      params: { RefNo: refNo },
    });
  },

  async createFeedback(payload: any) {
    return axios.post(`${process.env.ALJUF_BASE_URL}/ExternalLeadFeedback`, payload, { headers });
  },
};