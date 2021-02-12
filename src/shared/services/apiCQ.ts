import axios from 'axios';

const apiCQ = axios.create({
  baseURL: process.env.APP_API_URL,
  headers: { 'x-access-key': process.env.KEY_ACTIVE_INTEGRATION },
  validateStatus: status => {
    return status >= 200 && status < 300; // default
  },
});

export default apiCQ;
