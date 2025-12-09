import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allBooks } from "../data/books";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookId = Number(id);

  const book = allBooks.find((b) => b.id === bookId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // demo user – pore real logged in user diye replace korba
  const user = {
    name: "Demo User",
    email: "demo@bookcourier.com",
  };

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

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // ekhane backend e POST korba pore (order create)
    // ekhon just demo action
    console.log("New order:", {
      bookId: book.id,
      phone,
      address,
      name: user.name,
      email: user.email,
      status: "pending",
      paymentStatus: "unpaid",
    });

    // reset + close
    setPhone("");
    setAddress("");
    setIsModalOpen(false);

    alert("Order placed (demo)! In real app this will be saved to database.");
  };

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back to All Books
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Book image */}
          <div className="w-full h-72 md:h-96 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={book.img}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {book.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600">by {book.author}</p>

            <p className="mt-3 text-xs inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {book.category}
            </p>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              {book.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Price
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ${book.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                Order Now
              </button>
            </div>

            {/* Optional extra info section */}
            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <p>Delivery: 2-5 business days (demo)</p>
              <p>Return Policy: 7 days from delivery (demo)</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
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
                    value={user.name}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 text-sm"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
                >
                  Place Order
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
