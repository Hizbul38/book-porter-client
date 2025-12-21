import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/80x80?text=No+Image";

const MyWishlist = () => {
  const { user, loading } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [loadingWish, setLoadingWish] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      setLoadingWish(true);
      setError("");

      if (!user) {
        setItems([]);
        setError("Please login first");
        return;
      }

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setItems([]);
        setError(data?.message || "Failed to load wishlist");
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("wishlist load error:", e);
      setItems([]);
      setError("Failed to load wishlist");
    } finally {
      setLoadingWish(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, loading]);

  const removeItem = async (wishlistId) => {
    if (!wishlistId) return;
    if (!user) return alert("Please login first");

    try {
      setRemovingId(wishlistId);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Remove failed");
        return;
      }

      setItems((prev) =>
        (Array.isArray(prev) ? prev : []).filter((x) => String(x._id) !== String(wishlistId))
      );
    } catch (e) {
      console.error("wishlist remove error:", e);
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  if (loading || loadingWish) {
    return <p className="text-sm text-gray-600">Loading wishlist...</p>;
  }

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        My Wishlist
      </h1>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((w) => {
                const img =
                  typeof w?.image === "string" && w.image.startsWith("http")
                    ? w.image
                    : FALLBACK_IMAGE;

                return (
                  <tr key={w._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <img
                        src={img}
                        alt={w.bookTitle}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        to={`/books/${w.bookId}`}
                        className="underline text-gray-800 hover:text-gray-900"
                      >
                        {w.bookTitle || "Untitled"}
                      </Link>
                    </td>

                    <td className="px-4 py-3">{w.author || "—"}</td>

                    <td className="px-4 py-3">
                      ${Number(w.price || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeItem(w._id)}
                        disabled={removingId === w._id}
                        className={`text-xs px-3 py-1 rounded-full text-white ${
                          removingId === w._id
                            ? "bg-gray-400"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {removingId === w._id ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-10 text-center">
              No wishlisted books yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyWishlist;
