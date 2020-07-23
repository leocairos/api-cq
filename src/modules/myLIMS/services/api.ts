import axios from 'axios';

const apiMYLIMS = axios.create({
  baseURL: process.env.MYLIMS_URL,
  headers: { 'x-access-key': process.env.MYLIMS_TOKEN },
});

export default apiMYLIMS;
