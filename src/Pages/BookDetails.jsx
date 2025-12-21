import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import ReviewsSection from "../Components/ReviewsSection";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/400x520?text=No+Image";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wishlist
  const [wishLoading, setWishLoading] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);
  const [wishChecked, setWishChecked] = useState(false);

  // Order Modal
  const [orderOpen, setOrderOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ordering, setOrdering] = useState(false);

  const title = useMemo(() => book?.name || book?.title || "Untitled", [book]);
  const author = useMemo(() => book?.author || "—", [book]);

  const image = useMemo(() => {
    const img = book?.image;
    return typeof img === "string" && img.startsWith("http") ? img : FALLBACK_IMAGE;
  }, [book]);

  const isPublished = useMemo(
    () => String(book?.status || "published").toLowerCase() === "published",
    [book]
  );

  // ✅ Load book
  useEffect(() => {
    if (!API_URL) {
      console.error("VITE_API_URL missing");
      setBook(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);

        // 1) public fetch
        const res = await fetch(`${API_URL}/books/${id}`);
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          setBook(data);
          return;
        }

        // 2) if not ok, try token fetch (owner librarian/admin unpublished)
        if (!user || authLoading) {
          setBook(null);
          return;
        }

        const token = await user.getIdToken(true);

        const res2 = await fetch(`${API_URL}/books/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });

        const data2 = await res2.json().catch(() => ({}));

        if (!res2.ok) {
          setBook(null);
          return;
        }

        setBook(data2);
      } catch (e) {
        console.error("BookDetails load error:", e);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user, authLoading]);

  // ✅ Check wishlist already added
  useEffect(() => {
    if (!API_URL) return;

    const checkWishlist = async () => {
      try {
        setWishChecked(false);
        setWishAdded(false);

        if (authLoading) return;

        if (!user) {
          setWishChecked(true);
          return;
        }

        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/wishlist`, {
          headers: { authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => []);

        if (!res.ok) {
          console.error("wishlist check error:", res.status, data);
          setWishChecked(true);
          return;
        }

        const list = Array.isArray(data) ? data : [];
        const exists = list.some((w) => String(w.bookId) === String(id));
        setWishAdded(exists);
      } catch (e) {
        console.error("wishlist check error:", e);
      } finally {
        setWishChecked(true);
      }
    };

    checkWishlist();
  }, [id, user, authLoading]);

  const handleWishlist = async () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login first",
        confirmButtonText: "OK",
      });
      navigate("/login");
      return;
    }

    try {
      setWishLoading(true);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/wishlist`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: id }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data?.message || "Failed to add wishlist",
        });
        return;
      }

      setWishAdded(true);
      toast("✅ Added to wishlist");
    } catch (e) {
      console.error("wishlist add error:", e);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to add wishlist",
      });
    } finally {
      setWishLoading(false);
    }
  };

  // ✅ Open Order Modal
  const handleOpenOrder = () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login first",
        confirmButtonText: "OK",
      });
      navigate("/login");
      return;
    }
    if (!isPublished) {
      Swal.fire({
        icon: "warning",
        title: "Order Disabled",
        text: "This book is unpublished. Order disabled.",
      });
      return;
    }
    setOrderOpen(true);
  };

  // ✅ Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login first",
        confirmButtonText: "OK",
      });
      navigate("/login");
      return;
    }

    if (!phone.trim() || !address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Phone and Address required",
      });
      return;
    }

    try {
      setOrdering(true);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: id,
          phone: phone.trim(),
          address: address.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: data?.message || "Order failed",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "✅ Order placed successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      setOrderOpen(false);
      setPhone("");
      setAddress("");

      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error("order error:", err);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "Order failed",
      });
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <p className="p-6 text-sm">Loading book...</p>;
  if (!book) return <p className="p-6 text-sm text-red-600">Book not found.</p>;

  const displayName =
    user?.displayName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <Link to="/all-books" className="text-sm underline text-gray-600">
            ← Back to all books
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={image}
              alt={title}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              className="w-full h-[520px] object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">by {author}</p>

            <p className="text-xl font-semibold mt-4">
              ${Number(book?.price || 0).toFixed(2)}
            </p>

            {book?.description && (
              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                {book.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {/* ✅ Order Now */}
              <button
                onClick={handleOpenOrder}
                className="px-5 py-2.5 rounded-full text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Order Now
              </button>

              {/* ✅ Wishlist */}
              <button
                onClick={handleWishlist}
                disabled={!wishChecked || wishLoading || wishAdded}
                className={`px-5 py-2.5 rounded-full text-sm text-white ${
                  !wishChecked || wishLoading || wishAdded
                    ? "bg-gray-400"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {!wishChecked
                  ? "Checking..."
                  : wishAdded
                  ? "Wishlisted ✅"
                  : wishLoading
                  ? "Adding..."
                  : "Add to Wishlist"}
              </button>

              <button
                onClick={() => navigate("/dashboard/my-wishlist")}
                className="px-5 py-2.5 rounded-full text-sm border border-gray-300 hover:bg-gray-100"
              >
                Go to My Wishlist
              </button>
            </div>

            {!isPublished && (
              <p className="text-xs text-red-600 mt-3">
                This book is unpublished, public users can’t order it.
              </p>
            )}
          </div>
        </div>

        {/* ✅ Reviews Section */}
        <ReviewsSection bookId={book?._id || id} />

        {/* ✅ ORDER MODAL */}
        {orderOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setOrderOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Place Order</h3>
                <button
                  onClick={() => setOrderOpen(false)}
                  className="text-sm px-3 py-1 rounded-full border hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    value={displayName}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    value={user?.email || ""}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none"
                    placeholder="Delivery address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ordering}
                  className={`w-full py-2.5 rounded-full text-white ${
                    ordering ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {ordering ? "Placing order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookDetails;
