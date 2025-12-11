import { useState } from "react";

const initialBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    status: "published",
    price: 12,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "unpublished",
    price: 18,
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    status: "published",
    price: 15,
  },
];

const AdminManageBooks = () => {
  const [books, setBooks] = useState(initialBooks);

  const toggleStatus = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? {
              ...book,
              status: book.status === "published" ? "unpublished" : "published",
            }
          : book
      )
    );

    // TODO: backend call for publish/unpublish
    console.log("Toggled book status (demo) =>", id);
  };

  const deleteBook = (id) => {
    // TODO: backend call: delete book + delete all orders for that book
    console.log("Delete book and its orders (demo) =>", id);
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Manage Books
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        All books added by librarians. You can publish, unpublish or delete books.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{book.title}</td>
                  <td className="px-4 py-3 text-gray-600">{book.author}</td>
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
                  <td className="px-4 py-3 text-right">
                    ${book.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(book.id)}
                      className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      {book.status === "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="text-xs px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {books.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No books found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminManageBooks;
