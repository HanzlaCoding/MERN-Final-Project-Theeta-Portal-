import axios from 'axios';

// Create a configured Axios instance
// This gives us a single base URL for all our API calls
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Pointing to our backend running locally
  withCredentials: true, // This allows Axios to automatically send and receive cookies
});

// We no longer need the interceptor as the token is handled via HTTP-only cookies

export default api;