import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '/api';
if (import.meta.env.VITE_API_URL && !baseURL.endsWith('/api')) {
  baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser    = (data) => api.post('/auth/login', data);

// Posts
export const createPost  = (data) => api.post('/posts/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getFeed     = ()     => api.get('/posts/feed');    // all posts from all users
export const getAllPosts  = ()     => api.get('/posts/getall'); // only my posts (used by Profile)
export const getPostById = (id)   => api.get(`/posts/details/${id}`);
export const likePost    = (id)   => api.post(`/posts/like/${id}`);

// User
export const getMe       = ()     => api.get('/user/me');
export const getAllUsers  = ()     => api.get('/user/all');
export const followUser   = (id)  => api.post(`/user/follow/${id}`);
export const unfollowUser = (id)  => api.post(`/user/unfollow/${id}`);

// Follow data (followers / following list for a userId)
export const getFollowData = (id) => api.get(`/follower/data/${id}`);

// Toggle follow (uses /api/follower/follow, accepts { following: userId } in body)
export const toggleFollow = (targetId) => api.post('/follower/follow', { following: targetId });

export default api;
