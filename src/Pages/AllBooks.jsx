// src/Pages/AllBooks.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const categories = ["All", "Self Help", "Programming", "Productivity", "Finance", "Others"];

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  // ✅ MongoDB theke 20 ta published book load
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);

        // backend: /books?limit=20&status=published
        const res = await fetch(
          "http://localhost:3000/books?limit=20&status=published"
        );
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("All books fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    let visibleBooks = [...books];

    // search by title
    if (search.trim()) {
      visibleBooks = visibleBooks.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filter by category
    if (selectedCategory !== "All") {
      visibleBooks = visibleBooks.filter(
        (book) => (book.category || "Others") === selectedCategory
      );
    }

    // sort by price
    if (sortBy === "price-asc") {
      visibleBooks.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      visibleBooks.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return visibleBooks;
  }, [books, search, selectedCategory, sortBy]);

  if (loading) {
    return (
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-600">Loading books...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Books
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Browse all the books added by our librarians.
          </p>
        </div>

        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by book title..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category + Sort */}
          <div className="flex flex-wrap gap-3 md:justify-end">
            <select
              className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="none">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No books found. Try a different search or filter.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <Link
                to={`/all-books/${book._id}`}
                key={book._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-200">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    {book.author}
                  </p>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Category: {book.category || "Others"}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      ${Number(book.price).toFixed(2)}
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full border border-gray-300">
                      View Details
                    </span>
                  </div>
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
