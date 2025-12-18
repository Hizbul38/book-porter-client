import { createContext, useCallback, useState } from "react";

export const BooksContext = createContext(null);

const API_URL = "http://localhost:3000";

const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [librarianBooks, setLibrarianBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // =========================
  // PUBLIC BOOKS
  // =========================
  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await fetch(`${API_URL}/books`);
      const data = await res.json();
      setBooks(data || []);
    } catch (err) {
      console.error("fetchBooks error:", err);
    } finally {
      setLoadingBooks(false);
    }
  };

  // =========================
  // LIBRARIAN BOOKS (FIXED)
  // =========================
  const fetchLibrarianBooks = useCallback(async (email) => {
    if (!email) {
      setLibrarianBooks([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/books?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setLibrarianBooks(data || []);
    } catch (err) {
      console.error("fetchLibrarianBooks error:", err);
      setLibrarianBooks([]);
    }
  }, []);

  // =========================
  // ADD BOOK (AUTO REFRESH)
  // =========================
  const addBook = async (book, librarianEmail) => {
    try {
      const payload = {
        ...book,
        librarianEmail, // 🔥 CRITICAL
      };

      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to add book");
        return null;
      }

      // 🔥 auto sync MyBooks
      await fetchLibrarianBooks(librarianEmail);

      return data;
    } catch (err) {
      console.error("addBook error:", err);
      return null;
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleBookStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "published" ? "unpublished" : "published";

    try {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Status update failed");
        return;
      }

      // 🔥 update state locally
      setLibrarianBooks((prev) =>
        prev.map((b) => (b._id === id ? data : b))
      );
    } catch (err) {
      console.error("toggleBookStatus error:", err);
    }
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        librarianBooks,
        loadingBooks,
        fetchBooks,
        fetchLibrarianBooks,
        addBook,
        toggleBookStatus,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export default BooksProvider;
