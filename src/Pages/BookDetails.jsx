import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderContext } from "../Providers/OrderProvider";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x800?text=No+Image";

// 🔥 old (img) + new (image) support
const getBookImage = (book) => {
  if (book?.image && book.image.startsWith("http")) return book.image;
  if (book?.img && book.img.startsWith("http")) return book.img;
  return FALLBACK_IMAGE;
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addOrderToList } = useContext(OrderContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Order modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);

  // ===============================
  // Load single book
  // ===============================
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/books/${id}`);
        const data = await res.json();

        if (data?.message) setBook(null);
        else setBook(data);
      } catch (error) {
        console.error("Book details fetch error:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  // ===============================
  // Order submit
  // ===============================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      setPlacing(true);

      const orderPayload = {
        bookId: book._id,
        userName: name,
        userEmail: email,
        phone,
        address,
      };

      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Order failed");
        return;
      }

      // update MyOrders instantly
      addOrderToList(data);

      // reset
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setIsModalOpen(false);

      alert("✅ Order placed successfully!");
      navigate("/dashboard/my-orders");
    } catch (error) {
      console.error("Order create error:", error);
      alert("Something went wrong!");
    } finally {
      setPlacing(false);
    }
  };

  // ===============================
  // Loading / not found
  // ===============================
  if (loading) {
    return (
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-700">Loading...</p>
        </div>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-700 mb-4">Book not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back to All Books
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* IMAGE */}
          <div className="w-full h-72 md:h-96 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={getBookImage(book)}
              alt={book.title}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {book.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600">by {book.author}</p>

            <p className="mt-3 text-xs inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {book.category || "Others"}
            </p>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              {book.description || "No description available."}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Price
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ${Number(book.price).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                Order Now
              </button>
            </div>

            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <p>Delivery: 2–5 business days (demo)</p>
              <p>Return Policy: 7 days from delivery (demo)</p>
            </div>
          </div>
        </div>

        {/* ORDER MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>

              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Place Your Order
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Fill in your details to request home delivery for this book.
              </p>

              <form onSubmit={handlePlaceOrder} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
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
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="House, street, city, zip code"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={placing}
                  className={`w-full mt-2 px-4 py-2.5 rounded-full text-white text-sm font-medium ${
                    placing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800"
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
