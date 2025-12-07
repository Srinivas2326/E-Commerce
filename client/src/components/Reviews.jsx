import React, { useEffect, useState } from "react";
import { fetchProduct, addProductReview } from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuthContext();

  const loadReviews = async () => {
    try {
      const { data } = await fetchProduct(productId);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Review fetch failed:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setSuccess("Please write a comment!");
      return;
    }

    try {
      await addProductReview(productId, { rating, comment });
      setComment("");
      setRating(5);
      setHover(0);
      await loadReviews();

      setSuccess("Review added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setSuccess(err.response?.data?.message || "Failed to add review");
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  return (
    <section style={{ marginTop: 18 }}>
      <h3 style={{ marginBottom: 12 }}>Reviews</h3>

      {user ? (
        <form onSubmit={submitHandler} style={{ marginBottom: 16 }}>
          {success && (
            <p style={{ color: "limegreen", marginBottom: 6 }}>
              {success}
            </p>
          )}

          {/* ⭐ Interactive Star Rating */}
          <div style={{ marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHover(num)}
                onMouseLeave={() => setHover(0)}
                style={{
                  cursor: "pointer",
                  fontSize: "26px",
                  marginRight: "4px",
                  color:
                    (hover || rating) >= num ? "gold" : "gray",
                  transition: "0.15s",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write a review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              display: "block",
              marginTop: 8,
              marginBottom: 8,
              padding: 8,
              borderRadius: 6,
              backgroundColor: "var(--bg-light)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
            }}
          />

          <button className="btn btn-primary" type="submit">
            Submit Review
          </button>
        </form>
      ) : (
        <p>
          <a href="/login">Login</a> to write a review
        </p>
      )}

      {/* Review List */}
      <div>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((review) => (
          <div
            className="card"
            key={review._id}
            style={{
              marginBottom: 10,
              padding: "10px 12px",
              borderRadius: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{review.name || "User"}</strong>
              <span style={{ color: "gold", fontSize: "18px" }}>
                {review.rating} ★
              </span>
            </div>

            <p style={{ marginTop: 6, fontSize: "14px" }}>
              {review.comment}
            </p>

            <small className="text-muted">
              {new Date(review.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}
