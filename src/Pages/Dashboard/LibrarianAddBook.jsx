import { useContext } from "react";
import { BooksContext } from "../../Providers/BooksProvider";

const LibrarianAddBook = () => {
  const { addBook } = useContext(BooksContext);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newBook = {
      title: form.title.value,
      author: form.author.value,
      img: form.image.value,
      status: form.status.value, // published / unpublished
      price: parseFloat(form.price.value),
      category: form.category.value || "Others",
      description: form.description.value || "",
    };

    const saved = await addBook(newBook);

    if (saved) {
      form.reset();
      alert("✅ Book added successfully!");
    }
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Add New Book
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Add a new book to the library catalog. Only published books will be
        visible on the All Books page.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-xl">
        <form onSubmit={handleAddBook} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Book Name</label>
            <input
              type="text"
              name="title"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter book title"
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
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select
                name="status"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                defaultValue="published"
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
                name="price"
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="e.g. 15.99"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Category (optional)
            </label>
            <input
              type="text"
              name="category"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              placeholder="e.g. Programming, Self Help"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Short Description (optional)
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
            className="mt-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            Add Book
          </button>
        </form>
      </div>
    </section>
  );
};

export default LibrarianAddBook;
