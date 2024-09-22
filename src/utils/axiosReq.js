import axios from 'axios';

const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://ahmed-server.vercel.app/api';

export const axiosReq = axios.create({
  baseURL: baseURL,
  withCredentials: true
});