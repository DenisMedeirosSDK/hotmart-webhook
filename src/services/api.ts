import axios from 'axios';

export const apiBackend = axios.create({
  baseURL: process.env.API_BACKEND,
});
