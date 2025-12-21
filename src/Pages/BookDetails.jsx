import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import { OrderContext } from "../Providers/OrderProvider";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/600x800?text=No+Image";

const getBookImage = (book) => {
  const img = book?.image || book?.img || book?.photo || book?.cover;
  if (typeof img === "string" && img.startsWith("http")) return img;
  return FALLBACK_IMAGE;
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { addOrderToList } = useContext(OrderContext);

  const [book, setBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [bookError, setBookError] = useState("");

  // Modal + form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);

  const displayName = useMemo(() => {
    return user?.displayName || user?.name || "—";
  }, [user]);

  // ===============================
  // Load book details
  // ===============================
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoadingBook(true);
        setBookError("");

        if (!id) {
          setBook(null);
          setBookError("Invalid book id.");
          return;
        }

        const res = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`);

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          setBook(null);
          setBookError(text || "Book not found");
          return;
        }

        const data = await res.json();
        if (data?._id) {
          setBook(data);
        } else {
          setBook(null);
          setBookError("Book not found");
        }
      } catch (err) {
        console.error("Book load error:", err);
        setBook(null);
        setBookError("Failed to load book.");
      } finally {
        setLoadingBook(false);
      }
    };

    loadBook();
  }, [id]);

  // ===============================
  // Open modal
  // ===============================
  const openOrderModal = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  // ===============================
  // Place order
  // ===============================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return navigate("/login");
    }

    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (cleanPhone.length < 6) {
      alert("Please enter a valid phone number");
      return;
    }
    if (cleanAddress.length < 5) {
      alert("Please enter a valid address");
      return;
    }

    try {
      setPlacing(true);

      const token = await user.getIdToken(true); // ✅ always fresh

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book?._id,
          phone: cleanPhone,
          address: cleanAddress,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Order failed");
        return;
      }

      addOrderToList?.(data);

      setPhone("");
      setAddress("");
      setIsModalOpen(false);

      alert("✅ Order placed successfully!");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong");
    } finally {
      setPlacing(false);
    }
  };

  // ===============================
  // UI States
  // ===============================
  if (loadingBook) {
    return <p className="p-6 text-sm text-gray-600">Loading book...</p>;
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600">{bookError || "Book not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 border rounded-md text-sm"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-gray-500"
        >
          ← Back
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* IMAGE */}
          <div className="h-72 md:h-96 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={getBookImage(book)}
              alt={book.title || "Book"}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-sm text-gray-500">by {book.author || "—"}</p>

            <p className="mt-4 text-sm text-gray-700">
              {book.description || "No description available."}
            </p>

            <p className="mt-6 text-xl font-semibold">
              ${Number(book.price || 0).toFixed(2)}
            </p>

            <button
              onClick={openOrderModal}
              className="mt-6 px-5 py-2 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Order Now
            </button>

            <p className="mt-2 text-xs text-gray-500">
              Orders start as <span className="font-semibold">pending</span> and{" "}
              payment status <span className="font-semibold">unpaid</span>.
            </p>
          </div>
        </div>

        {/* ORDER MODAL */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-lg font-semibold mb-4">Place Your Order</h2>

              <form onSubmit={handlePlaceOrder} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={displayName}
                    readOnly
                    className="w-full border px-3 py-2 rounded-md bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full border px-3 py-2 rounded-md bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Enter phone number"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="House, street, city"
                    className="w-full border px-3 py-2 rounded-md resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={placing}
                  className={`w-full mt-2 py-2 rounded-md text-white ${
                    placing ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {placing ? "Placing..." : "Place Order"}
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
