import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BooksContext } from "../../Providers/BooksProvider";
import { AuthContext } from "../../Providers/AuthProvider";

const FALLBACK_IMAGE = "https://via.placeholder.com/100?text=No+Image";

const getTitle = (b) => b?.name || b?.title || b?.bookTitle || "Untitled";

const getImage = (b) => {
  const img = b?.image || b?.img || b?.photo || b?.cover;
  if (typeof img === "string" && img.startsWith("http")) return img;
  return FALLBACK_IMAGE;
};

const MyBooks = () => {
  const { librarianBooks, fetchLibrarianBooks, toggleBookStatus } =
    useContext(BooksContext);

  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;

    // ✅ updated provider: no email param
    fetchLibrarianBooks?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, loading]);

  const rows = useMemo(() => {
    const list = Array.isArray(librarianBooks) ? [...librarianBooks] : [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((b) => getTitle(b).toLowerCase().includes(q));
  }, [librarianBooks, search]);

  if (loading) {
    return <p className="text-center py-10 text-sm text-gray-600">Loading...</p>;
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            My Books
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Books you added. You can edit or unpublish (no delete).
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by book name..."
          className="w-full md:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Book Name</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((b) => {
                const status = (b?.status || "unpublished").toLowerCase();
                const isPublished = status === "published";

                return (
                  <tr key={b._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <img
                        src={getImage(b)}
                        alt={getTitle(b)}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>

                    <td className="px-4 py-3">{getTitle(b)}</td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          isPublished
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/librarian/books/${b._id}/edit`)
                        }
                        className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleBookStatus(b._id, status)}
                        className={`text-xs px-3 py-1 rounded-full text-white ${
                          isPublished
                            ? "bg-gray-900 hover:bg-gray-800"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        title={
                          isPublished
                            ? "Unpublish will hide from All Books"
                            : "Publish will show in All Books"
                        }
                      >
                        {isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-10 text-center">
              {search.trim()
                ? "No books matched your search."
                : "You have not added any books yet."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBooks;
