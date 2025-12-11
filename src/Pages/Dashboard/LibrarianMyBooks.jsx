import { useContext } from "react";
import { Link } from "react-router-dom";
import { BooksContext } from "../../Providers/BooksProvider";

const LibrarianMyBooks = () => {
  const { books, toggleBookStatus } = useContext(BooksContext);

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        My Books
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        All the books you have added. You can edit a book or change its publish
        status. Books cannot be deleted.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.img}
                        alt={book.title}
                        className="w-10 h-12 rounded object-cover border"
                      />
                      <span className="font-medium text-gray-900">
                        {book.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] capitalize ${
                        book.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => toggleBookStatus(book.id)}
                      className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      {book.status === "published" ? "Unpublish" : "Publish"}
                    </button>

                    <Link
                      to={`/dashboard/librarian/books/${book.id}/edit`}
                      state={{ book }}
                      className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {books.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              You have not added any books yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarianMyBooks;
