import { api } from './axios';

export const getEmployerJobs = () =>
  api.get('/api/user/employer/jobs/getall');

export const publishJob = (data) =>
  api.post('/api/user/employer/jobs/publish', data);

export const updateJob = (id, data) =>
  api.put(`/api/user/employer/jobs/update/${id}`, data);

export const deleteJob = (id) =>
  api.delete(`/api/user/employer/jobs/delete/${id}`);

// Public listing: backend may expose GET /api/jobs later for open jobs
export const getPublicJobs = () =>
  api.get('/api/jobs').catch(() => ({ data: { jobs: [] } }));
