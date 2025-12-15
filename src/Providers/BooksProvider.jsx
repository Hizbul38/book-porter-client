import { createContext, useEffect, useState } from "react";

export const BooksContext = createContext(null);

const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [librarianBooks, setLibrarianBooks] = useState([]);

  const librarian = { email: "librarian@bookcourier.com" }; // demo

  // public/all books
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/books?status=all");
      const data = await res.json();
      if (res.ok) setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchBooks error:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // librarian books
  const fetchLibrarianBooks = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/librarian/books?email=${encodeURIComponent(librarian.email)}`
      );
      const data = await res.json();
      if (res.ok) setLibrarianBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchLibrarianBooks error:", err);
    }
  };

  useEffect(() => {
    fetchLibrarianBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // add book (with librarianEmail)
  const addBook = async (bookData) => {
    try {
      const payload = { ...bookData, librarianEmail: librarian.email };

      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to add book");
        return null;
      }

      // ✅ update both lists instantly
      setBooks((prev) => [data, ...prev]);
      setLibrarianBooks((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("addBook error:", err);
      alert("Something went wrong!");
      return null;
    }
  };

  // edit book (db)
  const updateBook = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Update failed");
        return null;
      }

      // update in both states
      setBooks((prev) => prev.map((b) => (String(b._id) === String(id) ? data : b)));
      setLibrarianBooks((prev) =>
        prev.map((b) => (String(b._id) === String(id) ? data : b))
      );

      return data;
    } catch (err) {
      console.error("updateBook error:", err);
      alert("Something went wrong!");
      return null;
    }
  };

  // toggle publish/unpublish (db via updateBook)
  const toggleBookStatus = async (id, currentStatus) => {
    const next = currentStatus === "published" ? "unpublished" : "published";
    return updateBook(id, { status: next });
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        fetchBooks,
        librarianBooks,
        fetchLibrarianBooks,
        addBook,
        updateBook,
        toggleBookStatus,
        librarian, // demo
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export default BooksProvider;
