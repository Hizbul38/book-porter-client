import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const Stars = ({ value = 0 }) => {
  const v = Math.round(Number(value || 0));
  return (
    <span className="text-sm">
      {"★".repeat(v)}
      <span className="text-gray-300">{"★".repeat(Math.max(0, 5 - v))}</span>
    </span>
  );
};

const ReviewsSection = ({ bookId }) => {
  const { user, loading } = useContext(AuthContext);

  const [data, setData] = useState({ avgRating: 0, totalReviews: 0, reviews: [] });
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [elig, setElig] = useState({ canReview: false, alreadyReviewed: false });
  const [loadingElig, setLoadingElig] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const canShowForm = useMemo(() => {
    if (loading) return false;
    if (!user) return false;
    if (loadingElig) return false;
    return elig.canReview && !elig.alreadyReviewed;
  }, [user, loading, elig, loadingElig]);

  // load reviews (public)
  useEffect(() => {
    if (!bookId) return;

    const load = async () => {
      try {
        setLoadingReviews(true);
        const res = await fetch(`${API_URL}/reviews/book/${bookId}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("reviews api error", res.status, json);
          setData({ avgRating: 0, totalReviews: 0, reviews: [] });
          return;
        }
        setData({
          avgRating: Number(json.avgRating || 0),
          totalReviews: Number(json.totalReviews || 0),
          reviews: Array.isArray(json.reviews) ? json.reviews : [],
        });
      } catch (e) {
        console.error("reviews load error", e);
        setData({ avgRating: 0, totalReviews: 0, reviews: [] });
      } finally {
        setLoadingReviews(false);
      }
    };

    load();
  }, [bookId]);

  // eligibility (protected)
  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;
    if (!bookId) return;

    const load = async () => {
      try {
        setLoadingElig(true);
        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/reviews/eligibility/${bookId}`, {
          headers: { authorization: `Bearer ${token}` },
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("elig api error", res.status, json);
          setElig({ canReview: false, alreadyReviewed: false });
          return;
        }

        setElig({
          canReview: !!json.canReview,
          alreadyReviewed: !!json.alreadyReviewed,
        });
      } catch (e) {
        console.error("elig load error", e);
        setElig({ canReview: false, alreadyReviewed: false });
      } finally {
        setLoadingElig(false);
      }
    };

    load();
  }, [bookId, user, loading]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      setMsg("");

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          rating: Number(rating),
          comment,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(json?.message || "Failed to submit review");
        return;
      }

      setMsg("✅ Review submitted!");
      setComment("");

      // refresh reviews + eligibility
      const r2 = await fetch(`${API_URL}/reviews/book/${bookId}`);
      const j2 = await r2.json().catch(() => ({}));
      if (r2.ok) {
        setData({
          avgRating: Number(j2.avgRating || 0),
          totalReviews: Number(j2.totalReviews || 0),
          reviews: Array.isArray(j2.reviews) ? j2.reviews : [],
        });
      }

      setElig((p) => ({ ...p, alreadyReviewed: true }));
    } catch (e) {
      console.error("submit review error", e);
      setMsg("Review submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold">Reviews</h2>

        <div className="text-sm text-gray-700">
          <Stars value={data.avgRating} />{" "}
          <span className="ml-2">
            {data.avgRating.toFixed(1)} ({data.totalReviews})
          </span>
        </div>
      </div>

      {/* Form */}
      {!loading && user && (
        <div className="mt-4">
          {loadingElig ? (
            <p className="text-sm text-gray-500">Checking eligibility...</p>
          ) : canShowForm ? (
            <form
              onSubmit={submitReview}
              className="bg-white border rounded-xl p-4 space-y-3"
            >
              <div className="flex gap-3 items-center">
                <label className="text-sm text-gray-600">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Star
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
                placeholder="Write your review (optional)"
              />

              {msg && <p className="text-sm text-gray-700">{msg}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500">
              {elig.alreadyReviewed
                ? "You already reviewed this book."
                : "You can review only after ordering this book."}
            </p>
          )}
        </div>
      )}

      {/* List */}
      <div className="mt-5">
        {loadingReviews ? (
          <p className="text-sm text-gray-500">Loading reviews...</p>
        ) : data.reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {data.reviews.map((r) => (
              <div key={r._id} className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-900">
                    {r.userName || r.userEmail || "User"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <Stars value={r.rating} />
                  </div>
                </div>

                {r.comment ? (
                  <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                ) : (
                  <p className="text-sm text-gray-400 mt-2">—</p>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
