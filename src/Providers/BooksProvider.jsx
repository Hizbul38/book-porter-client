// src/Providers/BooksProvider.jsx
import { createContext, useState } from "react";

export const BooksContext = createContext(null);

// Demo initial books – pore backend theke load korba
const initialBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    price: 12,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    status: "published", // published | unpublished
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: 18,
    img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090",
    status: "published",
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    price: 15,
    img: "https://images.unsplash.com/photo-1544717302-de2939b7ef71",
    status: "unpublished",
  },
];

const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState(initialBooks);

  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: Date.now(), // demo id
    };
    setBooks((prev) => [...prev, newBook]);
  };

  const updateBook = (id, updatedFields) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === Number(id) ? { ...b, ...updatedFields } : b))
    );
  };

  const toggleBookStatus = (id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
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
    addBook,
    updateBook,
    toggleBookStatus,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
};

export default BooksProvider;
