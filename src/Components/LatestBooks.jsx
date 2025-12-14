// src/Components/LatestBooksSection.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LatestBooksSection = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestBooks = async () => {
      try {
        setLoading(true);

        // ✅ backend: /books?limit=6&status=published
        const res = await fetch(
          "http://localhost:3000/books?limit=6&status=published"
        );
        const data = await res.json();

        setLatestBooks(data);
      } catch (error) {
        console.error("Latest books fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLatestBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-600">Loading latest books...</p>
        </div>
      </section>
    );
  }

  if (!latestBooks.length) return null;

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Latest Books
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Recently added books by our librarians.
            </p>
          </div>

          <Link
            to="/all-books"
            className="text-xs md:text-sm text-blue-600 underline underline-offset-4"
          >
            View all books
          </Link>
        </div>

        {/* Books grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latestBooks.map((book) => (
            <article
              key={book._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-gray-200">
                <img
                  src={book.img}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col text-sm">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  {book.author}
                </p>
                <p className="text-[11px] text-gray-500 mb-3">
                  {book.category
                    ? `Category: ${book.category}`
                    : "Category: Others"}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    ${Number(book.price).toFixed(2)}
                  </span>

                  {/* ✅ Details button → Book Details page */}
                  <Link
                    to={`/all-books/${book._id}`}
                    className="text-[11px] px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBooksSection;
