import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { BooksContext } from "../../Providers/BooksProvider";

const API_URL = import.meta.env.VITE_API_URL;

const LibrarianEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { updateBook, fetchLibrarianBooks, fetchBooks } = useContext(BooksContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // form states
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("unpublished");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Others");
  const [description, setDescription] = useState("");

  // ✅ Load book (token required if unpublished)
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          setError("VITE_API_URL missing");
          return;
        }
        if (!id) {
          setError("Invalid book id");
          return;
        }
        if (!user) {
          setError("Please login first");
          return;
        }

        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/books/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // ✅ show real backend message (403/404)
          setError(data?.message || "Failed to load book");
          return;
        }

        // ✅ compatibility: name/title
        setName((data?.name || data?.title || "").toString());
        setAuthor((data?.author || "").toString());
        setImage((data?.image || "").toString());
        setStatus(((data?.status || "unpublished").toString()).toLowerCase());
        setPrice(String(data?.price ?? ""));
        setCategory((data?.category || "Others").toString());
        setDescription((data?.description || "").toString());
      } catch (e) {
        console.error("loadBook error:", e);
        setError("Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please login first");

    const cleanName = name.trim();
    const cleanAuthor = author.trim();
    const cleanImage = image.trim();
    const cleanStatus = (status || "unpublished").toLowerCase().trim();
    const cleanCategory = category.trim() || "Others";
    const cleanDescription = description.trim();
    const priceNum = Number(price);

    if (!cleanName) return alert("Book name required");
    if (!cleanAuthor) return alert("Author required");
    if (!cleanImage.startsWith("http"))
      return alert("Valid image URL required (http/https)");
    if (!["published", "unpublished"].includes(cleanStatus))
      return alert("Invalid status");
    if (Number.isNaN(priceNum) || priceNum <= 0)
      return alert("Price must be greater than 0");

    try {
      setSaving(true);
      setError("");

      const updated = await updateBook(id, {
        name: cleanName,
        author: cleanAuthor,
        image: cleanImage,
        status: cleanStatus,
        price: priceNum,
        category: cleanCategory,
        description: cleanDescription,
      });

      if (!updated) return;

      // ✅ refresh lists
      await Promise.all([fetchLibrarianBooks?.(), fetchBooks?.()]);

      alert("✅ Book updated successfully!");
      navigate("/dashboard/librarian/my-books");
    } catch (e) {
      console.error("save error:", e);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading book...</p>;
  }

  if (error) {
    return (
      <section className="max-w-xl">
        <h1 className="text-xl font-bold mb-3">Edit Book</h1>
        <p className="text-sm text-red-600">{error}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/dashboard/librarian/my-books")}
            className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800"
          >
            My Books
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Edit Book
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Update your book info. Unpublished books won’t show in All Books.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Book Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Book name"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Author"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Image URL</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200 bg-white"
              >
                <option value="published">published</option>
                <option value="unpublished">unpublished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="e.g. 15.99"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="e.g. Programming"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              placeholder="Write description..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded-full text-white text-sm ${
                saving ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LibrarianEditBook;
