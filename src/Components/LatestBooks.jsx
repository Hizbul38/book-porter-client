import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x400?text=No+Image";

const getBookImage = (book) => {
  if (book?.image && book.image.startsWith("http")) return book.image;
  if (book?.img && book.img.startsWith("http")) return book.img;
  return FALLBACK_IMAGE;
};

const LatestBooksSection = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestBooks = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/books?limit=6&status=published"
        );
        const data = await res.json();
        setLatestBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLatestBooks();
  }, []);

  if (loading || !latestBooks.length) return null;

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latestBooks.map((book) => (
            <article
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

              <div className="p-4 text-sm">
                <h3 className="font-semibold line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500">{book.author}</p>

                <div className="mt-3 flex justify-between items-center">
                  <span className="font-semibold">
                    ${Number(book.price).toFixed(2)}
                  </span>
                  <Link
                    to={`/all-books/${book._id}`}
                    className="text-xs underline"
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
