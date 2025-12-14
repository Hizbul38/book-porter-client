// src/Providers/BooksProvider.jsx
import { createContext, useEffect, useState } from "react";

export const BooksContext = createContext(null);

const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  // ✅ DB theke all books load (published + missing status included)
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/books?status=all");
      const data = await res.json();

      if (!res.ok) {
        console.error("fetchBooks failed:", data);
        return;
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchBooks error:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ✅ add book to DB + instantly update state
  const addBook = async (bookData) => {
    try {
      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to add book");
        return null;
      }

      // ✅ latest + all books instantly show
      setBooks((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("addBook error:", err);
      alert("Something went wrong!");
      return null;
    }
  };

  // ✅ local update (UI) — backend update route na thakle eta demo hishebe thakbe
  const updateBook = (id, updatedFields) => {
    setBooks((prev) =>
      prev.map((b) => (String(b._id) === String(id) ? { ...b, ...updatedFields } : b))
    );
  };

  // ✅ local delete (UI) — backend delete already ache
  const deleteBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to delete book");
        return;
      }

      setBooks((prev) => prev.filter((b) => String(b._id) !== String(bookId)));
    } catch (err) {
      console.error("deleteBook error:", err);
      alert("Something went wrong!");
    }
  };

  // ✅ local toggle (UI)
  const toggleBookStatus = (id) => {
    setBooks((prev) =>
      prev.map((b) =>
        String(b._id) === String(id)
          ? {
              ...b,
              status: b.status === "published" ? "unpublished" : "published",
            }
          : b
      )
    );
  };

  const value = {
    books,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    toggleBookStatus,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
};

export default BooksProvider;
