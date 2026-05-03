import axios from 'axios';

// Create a configured Axios instance
// This gives us a single base URL for all our API calls
const api = axios.create({
  baseURL: 'https://theeta-lms-backend.onrender.com/api', // Pointing to our backend running locally
  withCredentials: true, // This allows Axios to automatically send and receive cookies
});

// We no longer need the interceptor as the token is handled via HTTP-only cookies

export default api;