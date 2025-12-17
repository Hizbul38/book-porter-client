import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BooksContext } from "../../Providers/BooksProvider";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBook } = useContext(BooksContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch single book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Fetch book error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {
      title: e.target.title.value,
      image: e.target.image.value,
      category: e.target.category.value,
      price: Number(e.target.price.value),
      status: "pending", // 🔥 unpublished after edit
    };

    const result = await updateBook(id, updatedFields);

    if (result) {
      alert("Book updated successfully. Awaiting admin approval.");
      navigate("/dashboard/librarian/my-books");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!book) {
    return <p className="text-center py-10">Book not found</p>;
  }

  return (
    <section className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Book Name</label>
          <input
            name="title"
            defaultValue={book.title}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Image URL</label>
          <input
            name="image"
            defaultValue={book.image}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <input
            name="category"
            defaultValue={book.category}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            name="price"
            type="number"
            defaultValue={book.price}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditBook;
