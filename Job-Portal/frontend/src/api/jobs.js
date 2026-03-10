import { api } from './axios';

export const getEmployerJobs = () =>
  api.get('/api/user/employer/jobs/getall');

export const publishJob = (data) =>
  api.post('/api/user/employer/jobs/publish', data);

export const updateJob = (id, data) =>
  api.put(`/api/user/employer/jobs/update/${id}`, data);

export const deleteJob = (id) =>
  api.delete(`/api/user/employer/jobs/delete/${id}`);

export const getJobApplications = (jobId) =>
  api.get(`/api/user/employer/jobs/${jobId}/applications`);

export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/api/user/employer/jobs/application/update/${applicationId}`, { status });

// Public listing with optional search filters
export const getPublicJobs = (params = {}) =>
  api
    .get('/api/jobs', { params })
    .catch(() => ({ data: { jobs: [] } }));
