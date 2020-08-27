import axios from 'axios';

const apiPowerBI = axios.create({
  baseURL: `${process.env.POWERBI_URL_P1}${process.env.POWERBI_URL_P2}`,
  validateStatus: status => {
    return status >= 200 && status < 300; // default
  },
});

export default apiPowerBI;
