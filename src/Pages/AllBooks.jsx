import { useState, useMemo } from "react";
import { Link } from "react-router-dom";


const allBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    price: 12,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: 18,
    img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090",
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    price: 15,
    img: "https://images.unsplash.com/photo-1544717302-de2939b7ef71",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    price: 20,
    img: "https://images.unsplash.com/photo-1463320726281-696a485928c7",
  },
  {
    id: 5,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    price: 14,
    img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
  },
  {
    id: 6,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Finance",
    price: 10,
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    id: 7,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Finance",
    price: 11,
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
  },
  {
    id: 8,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    category: "Self Help",
    price: 16,
    img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  },
  {
    id: 9,
    title: "Refactoring",
    author: "Martin Fowler",
    category: "Programming",
    price: 22,
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
  },
  {
    id: 10,
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest, Stein",
    category: "Programming",
    price: 30,
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  },
  {
    id: 11,
    title: "Make Time",
    author: "Jake Knapp & John Zeratsky",
    category: "Productivity",
    price: 13,
    img: "https://images.unsplash.com/photo-1472745433479-4556f22e32c2",
  },
  {
    id: 12,
    title: "Essentialism",
    author: "Greg McKeown",
    category: "Productivity",
    price: 17,
    img: "https://images.unsplash.com/photo-1495446815901-594c234c9fa8",
  },
  {
    id: 13,
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    category: "Programming",
    price: 25,
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    id: 14,
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    category: "Finance",
    price: 19,
    img: "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a",
  },
  {
    id: 15,
    title: "Tiny Habits",
    author: "BJ Fogg",
    category: "Self Help",
    price: 13,
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
  },
  {
    id: 16,
    title: "The 4-Hour Workweek",
    author: "Tim Ferriss",
    category: "Productivity",
    price: 18,
    img: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea",
  },
  {
    id: 17,
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    category: "Programming",
    price: 24,
    img: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea",
  },
  {
    id: 18,
    title: "Your Money or Your Life",
    author: "Vicki Robin",
    category: "Finance",
    price: 15,
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
  },
  {
    id: 19,
    title: "Mindset",
    author: "Carol S. Dweck",
    category: "Self Help",
    price: 14,
    img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
  },
  {
    id: 20,
    title: "Getting Things Done",
    author: "David Allen",
    category: "Productivity",
    price: 16,
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  },
];

const categories = ["All", "Self Help", "Programming", "Productivity", "Finance"];

const AllBooks = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  const filteredBooks = useMemo(() => {
    let books = [...allBooks];

    // search by title
    if (search.trim()) {
      books = books.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filter by category
    if (selectedCategory !== "All") {
      books = books.filter((book) => book.category === selectedCategory);
    }

    // sort by price
    if (sortBy === "price-asc") {
      books.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      books.sort((a, b) => b.price - a.price);
    }

    return books;
  }, [search, selectedCategory, sortBy]);

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Books
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Browse and filter all available books from BookCourier. Later this
            page will be fully powered by your database.
          </p>
        </div>

        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by book title..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category + Sort */}
          <div className="flex flex-wrap gap-3 md:justify-end">
            <select
              className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="none">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No books found. Try a different search or filter.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-gray-200">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    {book.author}
                  </p>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Category: {book.category}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      ${book.price.toFixed(2)}
                    </span>
                    <Link
                     to={`/all-books/${book.id}`}
                    state={{ book }}
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                   View Details
                  </Link>

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBooks;
