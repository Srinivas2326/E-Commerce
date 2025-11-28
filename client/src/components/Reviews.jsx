import React, { useEffect, useState } from "react";
import API from "../api";
import { useAuthContext } from "../context/AuthContext";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { user, token } = useAuthContext();

  const fetch = () => API.get(`/reviews/product/${productId}`).then(r => setReviews(r.data));
  useEffect(() => { fetch(); }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", { product: productId, rating, comment }, { headers: { Authorization: `Bearer ${token}` }});
      setComment("");
      setRating(5);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <section style={{ marginTop: 18 }}>
      <h3>Reviews</h3>

      {user ? (
        <form onSubmit={submit} style={{ marginBottom: 12 }}>
          <select value={rating} onChange={(e)=>setRating(+e.target.value)}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n>1?"s":""}</option>)}
          </select>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a review" />
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      ) : <p><a href="/login">Login</a> to leave a review</p>}

      <div>
        {reviews.map(r => (
          <div className="card" key={r._id} style={{ marginBottom: 8 }}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <strong>{r.user?.username || "User"}</strong>
              <span>{r.rating} ★</span>
            </div>
            <p style={{marginTop:6}}>{r.comment}</p>
            <small className="text-muted">{new Date(r.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
