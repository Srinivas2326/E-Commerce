  import React, { useEffect, useState } from "react";
  import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
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

  const getCategoryLabel = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    return category.name || "";
  };

  const AdminProducts = () => {
    const { user } = useAuthContext();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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

    const loadCategories = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    useEffect(() => {
      loadProducts();
      loadCategories();
    }, []);

    const startEdit = (product) => {
      setEditingId(product._id);
      setForm({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category?._id || "", // ensure ID is stored
        countInStock: product.countInStock,
        description: product.description,
      });
    };

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      try {
        const payload = { ...form };

        if (editingId) {
          await updateProduct(editingId, payload);
        } else {
          await createProduct(payload);
        }

        setForm(emptyForm);
        setEditingId(null);
        await loadProducts();
      } catch (err) {
        setError(err?.response?.data?.message || "Save failed");
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
      <div style={{ padding: "1.5rem" }}>
        <h1>Admin — Manage Products</h1>

        {error && <p style={{ color: "tomato" }}>{error}</p>}

        <form
          onSubmit={handleSubmit}
          style={{ marginTop: "1rem", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "0.8rem" }}
        >
          <h3>{editingId ? "✏ Edit Product" : "➕ Add New Product"}</h3>

          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />

          {/* Category Dropdown Fixed */}
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input type="number" name="countInStock" placeholder="Stock Quantity" value={form.countInStock} onChange={handleChange} required />

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button className="btn btn-outline" type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <h2 style={{ marginTop: "2rem" }}>Product List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", borderRadius: "10px" }}>
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
                  <td>{getCategoryLabel(p.category)}</td>
                  <td><img src={p.image} width={50} height={50} alt="" /></td>
                  <td>
                    <button onClick={() => startEdit(p)}>Edit</button>
                    <button style={{ marginLeft: "0.5rem", color: "red" }} onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    );
  };

  export default AdminProducts;
