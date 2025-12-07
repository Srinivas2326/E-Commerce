import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct } from "../services/api";
import { useCartContext } from "../context/CartContext";
import Reviews from "../components/Reviews";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCartContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ Initial qty = 0 — No auto-add to cart issue
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;
  if (!product) return <p style={{ padding: "1rem" }}>Product not found</p>;

  const stock = product.countInStock;

  // 🛒 Check cart existing quantity
  const cartItem = cartItems.find((i) => i.product._id === product._id);
  const cartQty = cartItem?.qty || 0;

  // ✔ Max allowed = stock - already in cart
  const maxAllowed = stock - cartQty;
  const inStock = maxAllowed > 0;

  const increaseQty = () => {
    if (qty < maxAllowed) {
      setQty(qty + 1);
    } else {
      alert(`Only ${stock} available in stock!`);
    }
  };

  const decreaseQty = () => {
    if (qty > 0) setQty(qty - 1);
  };

  // ❌ Button disable if user reaches stock limit
  const reachedLimit = qty + cartQty > stock;

  const handleAddToCart = () => {
    if (!inStock || qty === 0 || reachedLimit) return;
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    if (!inStock || qty === 0 || reachedLimit) return;
    addToCart(product, qty);
    navigate("/checkout");
  };

  return (
    <div className="container page" style={{ paddingTop: 16 }}>
      <div className="card" style={{ padding: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            style={{
              objectFit: "contain",
              width: "100%",
              maxHeight: "350px",
            }}
          />

          {/* Details */}
          <div>
            <h2 style={{ marginBottom: "0.5rem" }}>{product.name}</h2>

            <h3 style={{ color: "#22c55e" }}>
              ₹{product.price}{" "}
              <span style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                ({stock} in stock)
              </span>
            </h3>

            <p style={{ marginTop: "0.5rem", opacity: 0.8 }}>
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <button
                onClick={decreaseQty}
                disabled={qty <= 0}
                style={{
                  opacity: qty <= 0 ? 0.5 : 1,
                  cursor: qty <= 0 ? "not-allowed" : "pointer",
                }}
              >
                ➖
              </button>

              <strong style={{ minWidth: 20, textAlign: "center" }}>
                {qty}
              </strong>

              <button
                onClick={increaseQty}
                disabled={!inStock || qty >= maxAllowed}
                style={{
                  opacity: !inStock || qty >= maxAllowed ? 0.5 : 1,
                  cursor:
                    !inStock || qty >= maxAllowed
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ➕
              </button>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                disabled={!inStock || qty === 0 || reachedLimit}
                className="btn btn-primary"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>

              <button
                disabled={!inStock || qty === 0 || reachedLimit}
                className="btn btn-outline"
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
