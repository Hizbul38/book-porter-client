import { useState, useMemo, useContext } from "react";
import { BooksContext } from "../Providers/BooksProvider";

const categories = ["All", "Self Help", "Programming", "Productivity", "Finance"];

const AllBooks = () => {
  const { books } = useContext(BooksContext);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  const filteredBooks = useMemo(() => {
    let visibleBooks = books.filter((b) => b.status === "published"); // 🔥 only published

    // search by title
    if (search.trim()) {
      visibleBooks = visibleBooks.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filter by category
    if (selectedCategory !== "All") {
      visibleBooks = visibleBooks.filter(
        (book) => book.category === selectedCategory
      );
    }

    // sort by price
    if (sortBy === "price-asc") {
      visibleBooks.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      visibleBooks.sort((a, b) => b.price - a.price);
    }

    return visibleBooks;
  }, [books, search, selectedCategory, sortBy]);

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Books
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Browse and filter all available books from BookPorter.
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
              <article
                key={book.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
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
                    Category: {book.category}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      ${book.price.toFixed(2)}
                    </span>
                    <button className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBooks;
