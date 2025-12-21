import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/300x400?text=No+Image";

const getTitle = (book) =>
  (book?.name || book?.title || book?.bookTitle || "Untitled").toString();

const getAuthor = (book) => (book?.author || book?.writer || "—").toString();

const getStatus = (book) => (book?.status || "").toString().toLowerCase();

const getBookImage = (book) => {
  const img = book?.image || book?.img || book?.photo || book?.cover;
  if (typeof img === "string" && img.startsWith("http")) return img;
  return FALLBACK_IMAGE;
};

const getTime = (book) => {
  const v = book?.createdAt || book?.created_at || book?.time;
  const t = new Date(v || 0).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const LatestBooksSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLatestBooks = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          setBooks([]);
          setError("VITE_API_URL is missing. Please set it in .env file.");
          return;
        }

        const res = await fetch(`${API_URL}/books`);
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          console.error("Latest books API error:", res.status, data);
          setBooks([]);
          setError(data?.message || "Failed to load latest books");
          return;
        }

        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Latest books load error:", err);
        setBooks([]);
        setError("Failed to load latest books");
      } finally {
        setLoading(false);
      }
    };

    loadLatestBooks();
  }, []);

  const latestBooks = useMemo(() => {
    let list = Array.isArray(books) ? [...books] : [];

    // ✅ safety: hide unpublished (server already published)
    list = list.filter((b) => {
      const s = getStatus(b);
      return !s || s === "published";
    });

    // ✅ ensure latest order even if backend sort missing
    list.sort((a, b) => getTime(b) - getTime(a));

    // ✅ only latest 6
    return list.slice(0, 8);
  }, [books]);

  if (loading) {
    return (
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-500">Loading latest books...</p>
        </div>
      </section>
    );
  }

  if (!latestBooks.length) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-2">Latest Books</h2>
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-sm text-gray-500">
              No latest books found. Add a book with status{" "}
              <span className="font-semibold">published</span>.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Latest Books</h2>
            <p className="text-sm text-gray-600 mt-1">
              Newly added published books from our collection.
            </p>
          </div>

          <Link
            to="/books"
            className="text-sm underline text-gray-700 hover:text-gray-900"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latestBooks.map((book) => (
            <article
              key={book._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition"
            >
              <div className="h-56 bg-gray-100">
                <img
                  src={getBookImage(book)}
                  alt={getTitle(book)}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 text-sm">
                <h3 className="font-semibold line-clamp-2">{getTitle(book)}</h3>
                <p className="text-xs text-gray-500 mt-1">{getAuthor(book)}</p>

                <div className="mt-3 flex justify-between items-center">
                  <span className="font-semibold">
                    ${Number(book?.price || 0).toFixed(2)}
                  </span>

                  <Link
                    to={`/books/${book._id}`}
                    className="text-xs underline text-gray-700 hover:text-gray-900"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-600 mt-4">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default LatestBooksSection;
