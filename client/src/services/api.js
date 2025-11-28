import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token from localStorage (if present) to every request
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("ecom-user");
  const user = stored ? JSON.parse(stored) : null;

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

/**
 * PRODUCTS
 */

// Optionally pass params, e.g. { category: categoryId }
export const fetchProducts = (params = {}) =>
  API.get("/products", { params });

export const fetchProduct = (id) => API.get(`/products/${id}`);

// Admin product management
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

/**
 * CATEGORIES
 */
export const fetchCategories = () => API.get("/categories");

/**
 * AUTH
 */
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/**
 * ORDERS
 */
export const createOrder = (data) => API.post("/orders", data);
export const fetchMyOrders = () => API.get("/orders/my-orders");
export const fetchAllOrders = () => API.get("/orders"); // admin only

/**
 * WISHLIST
 */
export const fetchWishlist = () => API.get("/users/wishlist");
export const addToWishlist = (productId) =>
  API.post(`/users/wishlist/${productId}`);
export const removeFromWishlist = (productId) =>
  API.delete(`/users/wishlist/${productId}`);

export default API;
