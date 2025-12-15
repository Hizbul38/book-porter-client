import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BooksContext } from "../../Providers/BooksProvider";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBook } = useContext(BooksContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/books/${id}`);
        const data = await res.json();
        if (res.ok) setBook(data);
        else setBook(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      title: form.title.value,
      author: form.author.value,
      img: form.img.value,
      status: form.status.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      description: form.description.value,
    };

    setSaving(true);
    const updated = await updateBook(id, payload);
    setSaving(false);

    if (updated) {
      alert("✅ Book updated!");
      navigate("/dashboard/librarian/my-books");
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;
  if (!book) return <p className="text-sm text-gray-600">Book not found.</p>;

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Edit Book</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input name="title" defaultValue={book.title} className="w-full border rounded-lg px-3 py-2" />
          <input name="author" defaultValue={book.author} className="w-full border rounded-lg px-3 py-2" />
          <input name="img" defaultValue={book.img} className="w-full border rounded-lg px-3 py-2" />

          <div className="grid gap-3 grid-cols-2">
            <select name="status" defaultValue={book.status || "published"} className="w-full border rounded-lg px-3 py-2">
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>

            <input name="price" type="number" step="0.01" defaultValue={book.price} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <input name="category" defaultValue={book.category || ""} className="w-full border rounded-lg px-3 py-2" />
          <textarea name="description" rows={3} defaultValue={book.description || ""} className="w-full border rounded-lg px-3 py-2" />

          <button
            disabled={saving}
            className={`px-4 py-2.5 rounded-full text-white ${saving ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"}`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditBook;
