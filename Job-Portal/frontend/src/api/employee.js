import { api } from './axios';

export const uploadResume = (formData) =>
  api.post('/api/user/emp/upload', formData);

export const applyToJob = (jobId, formData) =>
  api.post(`/api/user/emp/jobs/apply/${jobId}`, formData);
