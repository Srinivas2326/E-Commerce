import React, { useEffect, useState } from "react";
import { fetchAllOrders } from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchAllOrders();
      setOrders(data);
    };
    load();
  }, []);

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Admin — All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders placed</p>
      ) : (
        orders.map((o) => (
          <section key={o._id} style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
            <p><strong>Order ID:</strong> {o._id}</p>
            <p><strong>Customer:</strong> {o.user.name}</p>
            <p><strong>Total:</strong> ₹{o.totalPrice}</p>
            <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</p>

            <h3 style={{ marginTop: "1rem" }}>Items:</h3>
            <ul>
              {o.orderItems.map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.qty} (₹{i.price})
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
};

export default AdminOrders;
