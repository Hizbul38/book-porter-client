import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { BooksContext } from "../../Providers/BooksProvider";

const LibrarianEditBook = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { books, updateBook } = useContext(BooksContext);

  // jodi state theke ashe then oi book, otherwise context theke find
  const fromState = location.state?.book;
  const fromContext = books.find((b) => b.id === Number(id));
  const book = fromState || fromContext || null;

  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [img, setImg] = useState(book?.img || "");
  const [status, setStatus] = useState(book?.status || "published");
  const [price, setPrice] = useState(book?.price || 0);
  const [category, setCategory] = useState(book?.category || "");
  const [description, setDescription] = useState(book?.description || "");

  // jodi later context update hoy, form sync thakar jonno
  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setImg(book.img || "");
      setStatus(book.status || "published");
      setPrice(book.price || 0);
      setCategory(book.category || "");
      setDescription(book.description || "");
    }
  }, [book]);

  const handleUpdate = (e) => {
    e.preventDefault();

    updateBook(id, {
      title,
      author,
      img,
      status,
      price: Number(price),
      category,
      description,
    });

    alert("Book updated (demo).");
    navigate(-1);
  };

  if (!book) {
    return (
      <section>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Edit Book
        </h1>
        <p className="text-sm text-gray-600">
          No book data found for ID: <span className="font-mono">{id}</span>.
          Once you connect backend, this page will fetch by ID.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Edit Book
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Update the information of this book.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-xl">
        <form onSubmit={handleUpdate} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Book Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Book Image URL
            </label>
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default LibrarianEditBook;
