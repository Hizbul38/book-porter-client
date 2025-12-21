import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/60x60?text=No+Image";

const AdminManageBooks = () => {
  const { user } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user) {
        setBooks([]);
        setError("Please login first");
        return;
      }
      if (!API_URL) {
        setBooks([]);
        setError("VITE_API_URL missing");
        return;
      }

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/admin/books`, {
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setBooks([]);
        setError(data?.message || "Failed to load books");
        return;
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadBooks error:", e);
      setBooks([]);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const rows = useMemo(() => (Array.isArray(books) ? books : []), [books]);

  const setStatus = async (bookId, status) => {
    if (!bookId) return;
    if (!user)
      return Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login first",
      });

    try {
      setActingId(bookId);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/books/status/${bookId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data?.message || "Status update failed",
        });
        return;
      }

      // ✅ local update
      setBooks((prev) =>
        (Array.isArray(prev) ? prev : []).map((b) =>
          String(b._id) === String(bookId) ? { ...b, status } : b
        )
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: `Status changed to "${status}"`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error("setStatus error:", e);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Status update failed",
      });
    } finally {
      setActingId(null);
    }
  };

  const deleteBook = async (bookId) => {
    if (!bookId) return;
    if (!user)
      return Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login first",
      });

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this book?",
      text: "This will also delete all orders of this book.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setActingId(bookId);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: data?.message || "Delete failed",
        });
        return;
      }

      // ✅ remove from UI
      setBooks((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (b) => String(b._id) !== String(bookId)
        )
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "✅ Book deleted (and related orders removed).",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error("deleteBook error:", e);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Delete failed",
      });
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading books...</p>;

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Manage Books
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Publish / Unpublish books and delete books (deleting also deletes orders).
          </p>
        </div>

        <button
          onClick={loadBooks}
          className="text-xs px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Librarian</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((b) => {
                const status = (b?.status || "unpublished").toLowerCase();
                const disabled = actingId === b._id;

                const title = b?.name || b?.title || "Untitled";
                const author = b?.author || "—";
                const price = Number(b?.price || 0).toFixed(2);

                const img =
                  typeof b?.image === "string" && b.image.startsWith("http")
                    ? b.image
                    : FALLBACK_IMAGE;

                return (
                  <tr key={b._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <img
                        src={img}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        alt={title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>

                    <td className="px-4 py-3">{title}</td>
                    <td className="px-4 py-3">{author}</td>
                    <td className="px-4 py-3">${price}</td>
                    <td className="px-4 py-3">{b?.librarianEmail || "—"}</td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {status === "published" ? (
                        <button
                          disabled={disabled}
                          onClick={() => setStatus(b._id, "unpublished")}
                          className={`text-xs px-3 py-1 rounded-full border ${
                            disabled
                              ? "border-gray-200 text-gray-400"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          disabled={disabled}
                          onClick={() => setStatus(b._id, "published")}
                          className={`text-xs px-3 py-1 rounded-full ${
                            disabled
                              ? "bg-gray-200 text-gray-500"
                              : "bg-gray-900 text-white hover:bg-gray-800"
                          }`}
                        >
                          Publish
                        </button>
                      )}

                      <button
                        disabled={disabled}
                        onClick={() => deleteBook(b._id)}
                        className={`text-xs px-3 py-1 rounded-full text-white ${
                          disabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-10 text-center">
              No books found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminManageBooks;
