import { api } from './axios';

export const empRegister = (data) =>
  api.post('/api/user/emp/register', data);

export const empLogin = (data) =>
  api.post('/api/user/emp/login', data);

export const employerRegister = (data) =>
  api.post('/api/user/employer/register', data);

export const employerLogin = (data) =>
  api.post('/api/user/employer/login', data);
