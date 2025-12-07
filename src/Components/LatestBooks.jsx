// src/Components/LatestBooksGrid.jsx

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: "$12.00",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    price: "$15.00",
    img: "https://images.unsplash.com/photo-1544717302-de2939b7ef71",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: "$18.00",
    img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    price: "$20.00",
    img: "https://images.unsplash.com/photo-1463320726281-696a485928c7",
  },
];

const LatestBooks = () => {
  return (
    <section className="max-w-6xl mx-auto  py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-8">
          <span className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-3 text-center">
            Latest Books
          </p>
          <p className="text-gray-500">
            These are some of the latest titles added by our partner libraries.
            Soon this section will show data directly from your database.
          </p>
          </span>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {books.map((book) => (
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
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  {book.author}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {book.price}
                  </span>
                  <button className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100">
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBooks;
