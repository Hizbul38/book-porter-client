import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  "All",
  "Self Help",
  "Programming",
  "Productivity",
  "Finance",
  "Others",
];

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x400?text=No+Image";

const getBookImage = (book) => {
  if (book?.image && book.image.startsWith("http")) return book.image;
  if (book?.img && book.img.startsWith("http")) return book.img;
  return FALLBACK_IMAGE;
};

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/books?status=published");
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    let list = [...books];

    if (search.trim()) {
      list = list.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      list = list.filter(
        (b) => (b.category || "Others") === selectedCategory
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return list;
  }, [books, search, selectedCategory, sortBy]);

  if (loading) {
    return <p className="p-6 text-sm">Loading books...</p>;
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">All Books</h1>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.map((book) => (
            <Link
              to={`/all-books/${book._id}`}
              key={book._id}
              className="bg-white border rounded-xl overflow-hidden"
            >
              <div className="h-40 bg-gray-200">
                <img
                  src={getBookImage(book)}
                  alt={book.title}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500">{book.author}</p>
                <p className="text-sm font-semibold mt-2">
                  ${Number(book.price).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllBooks;
