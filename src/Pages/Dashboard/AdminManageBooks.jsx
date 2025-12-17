import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const AdminManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // bookId

  // =========================
  // Fetch all books
  // =========================
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/books`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch books error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // =========================
  // Publish / Unpublish
  // =========================
  const handleToggleStatus = async (id, currentStatus) => {
    if (!id) return;

    const nextStatus =
      currentStatus === "published" ? "unpublished" : "published";

    try {
      setActionLoading(id);

      const res = await fetch(`${API_URL}/books/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        alert("Failed to update status");
        return;
      }

      const updated = await res.json();

      // 🔥 update UI only after backend success
      setBooks((prev) =>
        prev.map((b) =>
          String(b._id) === String(id) ? updated : b
        )
      );
    } catch (err) {
      console.error("Toggle status error:", err);
      alert("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // Delete Book (DB + UI)
  // =========================
  const handleDeleteBook = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure? This will delete the book and all related orders."
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      const res = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete request failed");
        return;
      }

      const data = await res.json();

      if (data.bookDeleted === 1) {
        setBooks((prev) =>
          prev.filter((b) => String(b._id) !== String(id))
        );
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Manage Books (Admin)
      </h1>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Librarian</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-3">
                  <img
                    src={
                      b.image && b.image.startsWith("http")
                        ? b.image
                        : "https://via.placeholder.com/80"
                    }
                    alt={b.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>

                <td className="px-4 py-3">{b.title}</td>

                <td className="px-4 py-3 text-xs text-gray-600">
                  {b.librarianEmail}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] ${
                      b.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    disabled={actionLoading === String(b._id)}
                    onClick={() =>
                      handleToggleStatus(
                        String(b._id),
                        b.status
                      )
                    }
                    className="px-3 py-1 text-xs rounded-full border disabled:opacity-50"
                  >
                    {b.status === "published"
                      ? "Unpublish"
                      : "Publish"}
                  </button>

                  <button
                    disabled={actionLoading === String(b._id)}
                    onClick={() =>
                      handleDeleteBook(String(b._id))
                    }
                    className="px-3 py-1 text-xs rounded-full bg-red-600 text-white disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <p className="text-center py-6 text-sm text-gray-500">
            No books found
          </p>
        )}
      </div>
    </section>
  );
};

export default AdminManageBooks;
