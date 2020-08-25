import axios from 'axios';

const apiMYLIMS = axios.create({
  baseURL: process.env.MYLIMS_URL,
  headers: { 'x-access-key': process.env.MYLIMS_TOKEN },
  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: status => {
    return status >= 200 && status < 300; // default
  },
});

export default apiMYLIMS;
