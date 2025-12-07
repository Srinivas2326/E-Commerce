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

  const [qty, setQty] = useState(1); // ⭐ NEW

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;
  if (error) return <p style={{ padding: "1rem", color: "tomato" }}>{error}</p>;
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
    if (qty > 1) setQty(qty - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
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
          <div className="product-media" style={{ alignSelf: "start" }}>
            <div className="product-image-wrapper" style={{ padding: 12 }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ height: 320, objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="product-body">
            <h1>{product.name}</h1>

            <p style={{ opacity: 0.8 }}>
              {product.brand} {categoryName && <>· {categoryName}</>}
            </p>

            <h2 style={{ color: "#6df06d" }}>
              ₹{product.price}{" "}
              <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                ({product.countInStock} in stock)
              </span>
            </h2>

            <div style={{ marginBottom: 8 }}>
              <strong>{Number(product.rating || 0).toFixed(1)}</strong> ⭐
              <span style={{ marginLeft: 6 }}>
                ({product.numReviews || 0} Reviews)
              </span>
            </div>

            <p style={{ marginBottom: 12 }}>{product.description}</p>

            {/* ⭐ Quantity Control + Add To Cart */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* Quantity Selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#151515",
                  padding: "8px 16px",
                  borderRadius: 25,
                }}
              >
                <button
                  onClick={decreaseQty}
                  disabled={qty <= 1}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: qty > 1 ? "pointer" : "not-allowed",
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
                    color: "white",
                    cursor:
                      qty >= maxStock ? "not-allowed" : "pointer",
                  }}
                >
                  ➕
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn btn-add-cart"
              >
                Add to cart
              </button>

              <button className="btn btn-outline">Buy now</button>
            </div>
          </div>
        </div>
      </div>

      <Reviews productId={product._id} />
    </div>
  );
};

export default ProductDetails;
