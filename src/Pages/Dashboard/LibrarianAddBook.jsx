import { useContext, useState } from "react";
import { BooksContext } from "../../Providers/BooksProvider";
import { AuthContext } from "../../Providers/AuthProvider";

const LibrarianAddBook = () => {
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!user?.email) {
      alert("User not logged in");
      return;
    }

    const name = form.name.value.trim();
    const author = form.author.value.trim();
    const image = form.image.value.trim();
    const status = (form.status.value || "unpublished").toLowerCase();
    const price = Number(form.price.value);

    if (!name) return alert("Book name is required");
    if (!author) return alert("Author is required");
    if (!image.startsWith("http"))
      return alert("Please provide a valid image URL (http/https)");
    if (!["published", "unpublished"].includes(status))
      return alert("Status must be published/unpublished");
    if (Number.isNaN(price) || price <= 0)
      return alert("Price must be a number greater than 0");

    const newBook = {
      name,
      author,
      image,
      status,
      price,
      category: form.category.value.trim() || "Others",
      description: form.description.value.trim() || "",
    };

    try {
      setSubmitting(true);
      const saved = await addBook(newBook); // ✅ only one param

      if (saved) {
        form.reset();
        form.status.value = "unpublished";
        alert("✅ Book added successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Add Book
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        If status is <b>unpublished</b>, it will NOT appear on All Books page.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-xl">
        <form onSubmit={handleAddBook} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Book Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter book name"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Author</label>
            <input
              type="text"
              name="author"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Author name"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Book Image URL
            </label>
            <input
              type="text"
              name="image"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              placeholder="https://example.com/book.jpg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              name="status"
              defaultValue="unpublished"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
            >
              <option value="published">published</option>
              <option value="unpublished">unpublished</option>
            </select>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="e.g. 15.99"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Category (optional)
              </label>
              <input
                type="text"
                name="category"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="e.g. Programming"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none"
              placeholder="Write a short description..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`mt-2 px-4 py-2.5 rounded-full text-white text-sm font-medium ${
              submitting ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {submitting ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LibrarianAddBook;
