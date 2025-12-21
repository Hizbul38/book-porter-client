import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/300x400?text=No+Image";

const getTitle = (book) =>
  (book?.name || book?.title || book?.bookTitle || "Untitled").toString();

const getAuthor = (book) => (book?.author || book?.writer || "—").toString();

const getBookImage = (book) => {
  const img = book?.image || book?.img || book?.photo || book?.cover;
  if (typeof img === "string" && img.startsWith("http")) return img;
  return FALLBACK_IMAGE;
};

const getStatus = (book) => (book?.status || "").toString().toLowerCase();

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooks = async () => {
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
          console.error("Books API error:", res.status, data);
          setBooks([]);
          setError(data?.message || "Failed to load books");
          return;
        }

        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Books load error:", err);
        setBooks([]);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    let list = Array.isArray(books) ? [...books] : [];

    // ✅ Extra safety: hide unpublished (server already filters published)
    list = list.filter((b) => {
      const s = getStatus(b);
      return !s || s === "published";
    });

    // ✅ search by title/name
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => getTitle(b).toLowerCase().includes(q));
    }

    // ✅ sort by price
    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    }

    return list;
  }, [books, search, sortBy]);

  if (loading) {
    return <p className="p-6 text-sm text-gray-600">Loading books...</p>;
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">All Books</h1>
            <p className="text-sm text-gray-600 mt-1">
              Browse all published books. Use search and sorting to find quickly.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="text"
              placeholder="Search by book name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-200 w-full sm:w-64"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="none">Sort</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        )}

        {filteredBooks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-500">No books found.</p>
            <p className="text-xs text-gray-400 mt-1">
              If you just added a book, make sure its status is{" "}
              <span className="font-semibold">published</span>.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
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

                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {getTitle(book)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{getAuthor(book)}</p>

                  <p className="text-sm font-semibold mt-3">
                    ${Number(book?.price || 0).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBooks;
