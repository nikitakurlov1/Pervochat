import axios from 'axios';

// Prefer explicit runtime API base set via Vite env var `VITE_API_BASE_URL`.
// Example (Vercel): set VITE_API_BASE_URL=https://api.example.com
const configuredBase = (import.meta.env as Record<string, any>).VITE_API_BASE_URL;
const baseURL = configuredBase
  ? `${configuredBase.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, username: string, password: string) =>
    api.post('/auth/register', { email, username, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password })
};

export const postsAPI = {
  getAll: () => api.get('/posts'),
  getUserPosts: (userId: number) => api.get(`/posts/user/${userId}`),
  create: (formData: FormData) => api.post('/posts', formData),
  delete: (id: number) => api.delete(`/posts/${id}`),
  vote: (optionId: number) => api.post(`/posts/poll/${optionId}/vote`)
};

export const commentsAPI = {
  create: (postId: number, text: string) =>
    api.post('/comments', { postId, text }),
  delete: (id: number) => api.delete(`/comments/${id}`)
};

export const likesAPI = {
  toggle: (postId: number) => api.post('/likes', { postId })
};

export const trustBoxAPI = {
  create: (content: string) => api.post('/trustbox', { content }),
  getMy: () => api.get('/trustbox/my'),
  getAll: () => api.get('/trustbox/all'),
  reply: (id: number, reply: string) => api.patch(`/trustbox/${id}/reply`, { reply })
};

export default api;
