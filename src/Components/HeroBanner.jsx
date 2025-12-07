import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  "https://i.pinimg.com/736x/11/cf/bb/11cfbb172462ca782209477399da84cc.jpg",
  "https://i.pinimg.com/1200x/f7/24/9a/f7249ad37f17039c1c05c1bf16e3eb4c.jpg",
  "https://i.pinimg.com/1200x/23/31/1d/23311d59e5298e58d997c215446c4c3c.jpg",
];

const HeroBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">

        {/* Left Text */}
        <div>
          <p className="text-blue-600 font-semibold mb-2 text-sm tracking-widest">
            Welcome to BookPorter
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-4">
            Get Your Favorite Books Delivered<br />Right to Your Door.
          </h1>

          <p className="text-gray-600 mb-5">
            Borrow from nearest libraries and enjoy fast home delivery. Reading
            has never been this easy!
          </p>

          <Link
            to="/all-books"
            className="bg-blue-600 text-white px-5 py-2 rounded text-sm"
          >
            Browse Books
          </Link>
        </div>

        {/* Right Slider */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
          <img
            src={slides[index]}
            alt="book slide"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;
