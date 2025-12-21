import { useContext, useState } from "react";
import { BooksContext } from "../../Providers/BooksProvider";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";

const LibrarianAddBook = () => {
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!user?.email) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "User not logged in",
      });
      return;
    }

    const name = form.name.value.trim();
    const author = form.author.value.trim();
    const image = form.image.value.trim();
    const status = (form.status.value || "unpublished").toLowerCase();
    const price = Number(form.price.value);

    if (!name)
      return Swal.fire({
        icon: "warning",
        title: "Missing book name",
        text: "Book name is required",
      });

    if (!author)
      return Swal.fire({
        icon: "warning",
        title: "Missing author",
        text: "Author is required",
      });

    if (!image.startsWith("http"))
      return Swal.fire({
        icon: "warning",
        title: "Invalid image URL",
        text: "Please provide a valid image URL (http/https)",
      });

    if (!["published", "unpublished"].includes(status))
      return Swal.fire({
        icon: "warning",
        title: "Invalid status",
        text: "Status must be published/unpublished",
      });

    if (Number.isNaN(price) || price <= 0)
      return Swal.fire({
        icon: "warning",
        title: "Invalid price",
        text: "Price must be a number greater than 0",
      });

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

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "✅ Book added successfully!",
          timer: 1300,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to add book",
      });
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
