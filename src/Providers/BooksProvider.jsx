import { createContext, useCallback, useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const BooksContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

const BooksProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [librarianBooks, setLibrarianBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // =========================
  // PUBLIC BOOKS (published only)
  // =========================
  const fetchBooks = useCallback(async () => {
    try {
      setLoadingBooks(true);

      if (!API_URL) {
        console.error("VITE_API_URL missing");
        setBooks([]);
        return;
      }

      const res = await fetch(`${API_URL}/books`);
      const data = await res.json().catch(() => []);

      if (!res.ok) {
        console.error("fetchBooks API error:", res.status, data);
        setBooks([]);
        return;
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchBooks error:", err);
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  // =========================
  // LIBRARIAN BOOKS (own books)
  // GET /books/mine (protected)
  // =========================
  const fetchLibrarianBooks = useCallback(async () => {
    try {
      if (!user?.email) {
        setLibrarianBooks([]);
        return;
      }

      if (!API_URL) {
        console.error("VITE_API_URL missing");
        setLibrarianBooks([]);
        return;
      }

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/books/mine`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        console.error("fetchLibrarianBooks API error:", res.status, data);
        setLibrarianBooks([]);
        return;
      }

      setLibrarianBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchLibrarianBooks error:", err);
      setLibrarianBooks([]);
    }
  }, [user?.email, user]);

  // =========================
  // ADD BOOK (protected) + INSTANT update MyBooks
  // POST /books (verifyToken + verifyLibrarian)
  // =========================
  const addBook = useCallback(
    async (book) => {
      try {
        if (!user) {
          alert("Please login first");
          return null;
        }

        if (!API_URL) {
          alert("VITE_API_URL missing");
          return null;
        }

        const token = await user.getIdToken(true);

        const payload = {
          ...book,
          name: (book?.name || book?.title || "").trim(),
          author: (book?.author || "").trim(),
          image: (book?.image || "").trim(),
          status: (book?.status || "unpublished").toLowerCase(),
          price: Number(book?.price || 0),
        };

        const res = await fetch(`${API_URL}/books`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          alert(data?.message || "Failed to add book");
          return null;
        }

        // ✅ INSTANT: MyBooks list update
        setLibrarianBooks((prev) => [data, ...(Array.isArray(prev) ? prev : [])]);

        // ✅ INSTANT: if published, public list also update
        if ((data?.status || "").toLowerCase() === "published") {
          setBooks((prev) => [data, ...(Array.isArray(prev) ? prev : [])]);
        }

        // ✅ optional sync
        fetchLibrarianBooks();
        fetchBooks();

        return data;
      } catch (err) {
        console.error("addBook error:", err);
        return null;
      }
    },
    [user, fetchBooks, fetchLibrarianBooks]
  );

  // =========================
  // UPDATE BOOK (Edit page)
  // PATCH /books/:id (verifyToken + verifyLibrarian)
  // =========================
  const updateBook = useCallback(
    async (id, updates) => {
      try {
        if (!user) {
          alert("Please login first");
          return null;
        }

        if (!API_URL) {
          alert("VITE_API_URL missing");
          return null;
        }

        if (!id) {
          alert("Invalid book id");
          return null;
        }

        const token = await user.getIdToken(true);

        const payload = {
          ...updates,
        };

        // (optional) normalize if fields exist
        if (payload.name !== undefined) payload.name = String(payload.name).trim();
        if (payload.title !== undefined) payload.title = String(payload.title).trim();
        if (payload.author !== undefined) payload.author = String(payload.author).trim();
        if (payload.image !== undefined) payload.image = String(payload.image).trim();
        if (payload.status !== undefined) payload.status = String(payload.status).toLowerCase().trim();
        if (payload.price !== undefined) payload.price = Number(payload.price);

        const res = await fetch(`${API_URL}/books/${id}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          alert(data?.message || "Failed to update book");
          return null;
        }

        // ✅ update librarian list locally
        setLibrarianBooks((prev) =>
          (Array.isArray(prev) ? prev : []).map((b) =>
            String(b._id) === String(id) ? data : b
          )
        );

        // ✅ keep public list in sync (published only)
        const isPublished = (data?.status || "").toLowerCase() === "published";

        setBooks((prev) => {
          const list = Array.isArray(prev) ? [...prev] : [];
          const idx = list.findIndex((b) => String(b._id) === String(id));

          if (isPublished) {
            if (idx >= 0) list[idx] = data;
            else list.unshift(data);
            return list;
          }

          // unpublished => remove from public list
          if (idx >= 0) list.splice(idx, 1);
          return list;
        });

        return data;
      } catch (err) {
        console.error("updateBook error:", err);
        alert("Failed to update book");
        return null;
      }
    },
    [user]
  );

  // =========================
  // TOGGLE STATUS (librarian own book)
  // PATCH /books/:id
  // =========================
  const toggleBookStatus = useCallback(
    async (id, currentStatus) => {
      try {
        if (!user) {
          alert("Please login first");
          return;
        }

        const newStatus =
          (currentStatus || "").toLowerCase() === "published"
            ? "unpublished"
            : "published";

        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/books/${id}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          alert(data?.message || "Status update failed");
          return;
        }

        // ✅ update librarian list instantly
        setLibrarianBooks((prev) =>
          (Array.isArray(prev) ? prev : []).map((b) =>
            String(b._id) === String(id) ? data : b
          )
        );

        // ✅ sync public list (published filter)
        const isPublished = (data?.status || "").toLowerCase() === "published";

        setBooks((prev) => {
          const list = Array.isArray(prev) ? [...prev] : [];
          const idx = list.findIndex((b) => String(b._id) === String(id));

          if (isPublished) {
            if (idx >= 0) list[idx] = data;
            else list.unshift(data);
            return list;
          }

          if (idx >= 0) list.splice(idx, 1);
          return list;
        });
      } catch (err) {
        console.error("toggleBookStatus error:", err);
      }
    },
    [user]
  );

  return (
    <BooksContext.Provider
      value={{
        books,
        librarianBooks,
        loadingBooks,
        fetchBooks,
        fetchLibrarianBooks,
        addBook,
        updateBook, // ✅ added
        toggleBookStatus,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export default BooksProvider;
