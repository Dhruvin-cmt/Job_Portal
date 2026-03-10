import { api } from './axios';

export const empRegister = (data) =>
  api.post('/api/user/emp/register', data);

export const empLogin = (data) =>
  api.post('/api/user/emp/login', data);

export const employerRegister = (data) =>
  api.post('/api/user/employer/register', data);

export const employerLogin = (data) =>
  api.post('/api/user/employer/login', data);

export const empMe = () => api.get('/api/user/emp/me');
export const employerMe = () => api.get('/api/user/employer/me');

export const empLogout = () => api.post('/api/user/emp/logout');
export const employerLogout = () => api.post('/api/user/employer/logout');
