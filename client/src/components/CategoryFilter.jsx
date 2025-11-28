// client/src/components/CategoryFilter.jsx
import React, { useEffect, useState } from "react";
import { fetchCategories } from "../services/api";

export default function CategoryFilter({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <p style={{ marginBottom: 16, opacity: 0.8 }}>
        Loading categories…
      </p>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {error && (
        <p style={{ color: "tomato", marginBottom: 8 }}>{error}</p>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        style={{
          width: "250px",
          padding: "10px",
          borderRadius: "8px",
          background: "#020617",
          border: "1px solid #4b5563",
          color: "#e5e7eb",
        }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
