import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../services/api";
import { useCartContext } from "../context/CartContext";
import Reviews from "../components/Reviews";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCartContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("fetchProduct error:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading)
    return <p style={{ padding: "1rem" }}>Loading product...</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "tomato" }}>
        {error}
      </p>
    );
  if (!product)
    return <p style={{ padding: "1rem" }}>Product not found.</p>;

  const inStock = (product.countInStock ?? 0) > 0;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name;

  return (
    <div className="container page" style={{ paddingTop: 12 }}>
      <div className="card" style={{ padding: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 360px) 1fr",
            gap: "1.5rem",
            alignItems: "start",
            rowGap: "1rem",
          }}
        >
          {/* media */}
          <div className="product-media" style={{ alignSelf: "start" }}>
            <div className="product-image-wrapper" style={{ padding: 12 }}>
              <img
                src={product.image || "https://via.placeholder.com/600x400"}
                alt={product.name}
                className="product-image"
                style={{ height: 320, objectFit: "contain" }}
              />
            </div>
          </div>

          {/* details */}
          <div className="product-body">
            <h1 className="product-title" style={{ marginBottom: 8 }}>
              {product.name}
            </h1>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {product.brand && (
                <span className="product-brand">{product.brand}</span>
              )}
              {categoryName && (
                <span className="product-category-pill">
                  {categoryName}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <div
                className="product-price"
                style={{ fontSize: "1.4rem", fontWeight: 700 }}
              >
                ₹{product.price}
              </div>
              <div className="text-muted">
                {inStock
                  ? `(${product.countInStock} in stock)`
                  : "Out of stock"}
              </div>
            </div>

            {/* ⭐ Rating display - FIXED */}
            <div style={{ marginBottom: 8 }}>
              <strong>{Number(product.rating || 0).toFixed(1)}</strong> ⭐
              <span style={{ marginLeft: 6 }}>
                ({product.numReviews || 0} Reviews)
              </span>
            </div>

            <p
              style={{
                marginTop: 8,
                marginBottom: 12,
                color: "var(--text-soft)",
              }}
            >
              {product.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <button
                onClick={() => addToCart(product)}
                disabled={!inStock}
                className="btn btn-add-cart"
                style={{
                  padding: "0.6rem 1.1rem",
                }}
              >
                {inStock ? "Add to cart" : "Out of stock"}
              </button>

              <button
                className="btn btn-outline"
                style={{ padding: "0.55rem 0.95rem" }}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div style={{ marginTop: "1.35rem" }}>
        <Reviews productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetails;
