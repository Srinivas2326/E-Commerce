import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct } from "../services/api";
import { useCartContext } from "../context/CartContext";
import Reviews from "../components/Reviews";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ Initial qty = 0
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
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

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "red" }}>
        {error}
      </p>
    );
  if (!product) return <p style={{ padding: "1rem" }}>Product not found</p>;

  const inStock = product.countInStock > 0;
  const maxStock = product.countInStock;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name;

  const increaseQty = () => {
    if (qty < maxStock) setQty(qty + 1);
  };

  const decreaseQty = () => {
    if (qty > 0) setQty(qty - 1);
  };

  const handleAddToCart = () => {
    if (qty === 0) return;
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    if (qty === 0) return;
    addToCart(product, qty);
    navigate("/checkout");
  };

  return (
    <div className="container page" style={{ paddingTop: 12 }}>
      <div className="card" style={{ padding: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 360px) 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Product image */}
          <div className="product-media">
            <div style={{ padding: 12 }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  height: 320,
                  objectFit: "contain",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Right side Product details */}
          <div className="product-body">
            <h1 style={{ marginBottom: 8 }}>{product.name}</h1>

            <p style={{ opacity: 0.8 }}>
              {product.brand}
              {categoryName && <> · {categoryName}</>}
            </p>

            <h2 style={{ color: "#2ce539" }}>
              ₹{product.price}{" "}
              <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                ({product.countInStock} in stock)
              </span>
            </h2>

            {/* Rating */}
            <div style={{ marginBottom: 8 }}>
              <strong>{Number(product.rating || 0).toFixed(1)}</strong> ⭐
              <span style={{ marginLeft: 6 }}>
                ({product.numReviews || 0} Reviews)
              </span>
            </div>

            <p style={{ marginBottom: 12 }}>{product.description}</p>

            {/* ⭐ Quantity + Add/Buy Now */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* Qty Selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "#131313",
                  padding: "6px 18px",
                  borderRadius: 25,
                }}
              >
                <button
                  onClick={decreaseQty}
                  disabled={qty <= 0}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.2rem",
                    color: qty > 0 ? "white" : "#555",
                    cursor: qty > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  ➖
                </button>

                <strong>{qty}</strong>

                <button
                  onClick={increaseQty}
                  disabled={qty >= maxStock}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.2rem",
                    color: qty >= maxStock ? "#555" : "white",
                    cursor:
                      qty >= maxStock ? "not-allowed" : "pointer",
                  }}
                >
                  ➕
                </button>
              </div>

              {/* Add to Cart */}
              <button
                className="btn btn-add-cart"
                disabled={!inStock || qty === 0}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>

              {/* Buy Now */}
              <button
                className="btn btn-outline"
                style={{ padding: "0.55rem 0.95rem" }}
                disabled={!inStock || qty === 0}
                onClick={handleBuyNow}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={product._id} />
    </div>
  );
};

export default ProductDetails;
