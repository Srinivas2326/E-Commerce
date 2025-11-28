import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";
import { useAuthContext } from "../context/AuthContext";

const emptyForm = {
  name: "",
  price: "",
  image: "",
  brand: "",
  category: "",
  countInStock: "",
  description: "",
};

const AdminProducts = () => {
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProducts();
      setProducts(data);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Prefill form when editing
  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  if (!user?.isAdmin) {
    return <h2 style={{ padding: "1rem" }}>❌ Admin access only</h2>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin — Manage Products</h1>

      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem", maxWidth: "500px" }}>
        <h3>{editingId ? "✏ Edit Product" : "➕ Add New Product"}</h3>

        {Object.keys(emptyForm).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            required
            style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem" }}
          />
        ))}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
            style={{ marginLeft: "1rem" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* PRODUCT TABLE */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Product List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>₹{p.price}</td>
                  <td>{p.countInStock}</td>
                  <td>{p.category}</td>
                  <td>
                    <img src={p.image} alt={p.name} width="60" />
                  </td>
                  <td>
                    <button onClick={() => startEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={{ marginLeft: "0.5rem" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
