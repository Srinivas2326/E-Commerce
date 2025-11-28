import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminProducts from "../pages/AdminProducts";
import MyOrders from "../pages/MyOrders";
import ProtectedRoute from "../components/ProtectedRoute";
import Wishlist from "../pages/Wishlist";


const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected user routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute adminOnly>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRouter;
