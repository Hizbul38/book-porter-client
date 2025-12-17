import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BooksContext } from "../../Providers/BooksProvider";
import { AuthContext } from "../../Providers/AuthProvider";

const MyBooks = () => {
  const { librarianBooks, fetchLibrarianBooks, toggleBookStatus } =
    useContext(BooksContext);

  const { user, loading } = useContext(AuthContext); // ✅ correct context
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;

    fetchLibrarianBooks(user.email);
  }, [user, loading, fetchLibrarianBooks]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        My Books
      </h1>

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
              {librarianBooks.map((b) => {
                // 🔥 image fallback + URL safety
                const imageUrl =
                  b.image && b.image.startsWith("http")
                    ? b.image
                    : "https://via.placeholder.com/100";

                return (
                  <tr key={b._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <img
                        src={imageUrl}
                        alt={b.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>

                    <td className="px-4 py-3">{b.title}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          b.status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/librarian/books/${String(b._id)}/edit`
                          )
                        }
                        className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleBookStatus(b._id, b.status)}
                        className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                      >
                        {b.status === "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {librarianBooks.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              You have not added any books yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBooks;
