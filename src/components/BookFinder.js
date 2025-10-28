import React, { useState, useEffect } from "react";
import sampleData from "../data/sampleData";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BookFinder.css";

function BookFinder() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useSample, setUseSample] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("alex_user");
    if (!user) navigate("/login");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("alex_user");
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && !useSample) {
      alert("Please enter a book title or use sample data!");
      return;
    }

    if (useSample) {
      setBooks(sampleData.docs);
      return;
    }

    setLoading(true);
    try {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch books. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  const getCover = (cover_i) =>
    cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
      : "https://via.placeholder.com/180x260?text=No+Cover";

  return (
    <div className="bookfinder-dark d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark glass-nav shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold neon-text">📚 Alex’s Book Finder</span>
          <div className="d-flex">
            <button
              className="btn btn-outline-light btn-sm me-2"
              onClick={() => window.location.reload()}
            >
              Home
            </button>
            <button
              className="btn btn-outline-info btn-sm me-2"
              onClick={() =>
                alert(`Profile: ${localStorage.getItem("alex_user")}`)
              }
            >
              Profile
            </button>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Search Section */}
      <div className="container py-5 flex-grow-1">
        <div className="search-box-dark p-4 mx-auto mb-5 rounded shadow-lg text-center">
          <h2 className="fancy-title mb-4">✨ Find Your Next Read ✨</h2>
          <form onSubmit={handleSearch}>
            <div className="input-group input-group-lg">
              <input
                className="form-control dark-input highlight-input"
                placeholder="🔍 Search for a book title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-neon" type="submit">
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            <div className="form-check mt-3 text-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="sampleCheck"
                checked={useSample}
                onChange={(e) => setUseSample(e.target.checked)}
              />
              <label className="form-check-label ms-2 text-light" htmlFor="sampleCheck">
                Use sample data (demo)
              </label>
            </div>
          </form>
        </div>

        {/* Book Cards */}
        <div className="row g-4">
          {books.length === 0 && !loading && (
            <div className="col-12 text-center text-secondary">
              <p>No books to display yet. Try searching something!</p>
            </div>
          )}
          {books.map((book, idx) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={idx}>
              <div className="card h-100 border-0 shadow-sm book-card-dark">
                <img
                  src={getCover(book.cover_i)}
                  className="card-img-top"
                  alt={book.title}
                  style={{ height: 260, objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h6 className="card-title text-light">{book.title}</h6>
                  <p className="text-secondary mb-2">
                    {book.author_name ? book.author_name.join(", ") : "Unknown"}
                  </p>
                  <small className="text-muted">
                    {book.first_publish_year
                      ? `First published: ${book.first_publish_year}`
                      : "Year: N/A"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-dark text-center py-3 mt-auto">
        <small>© {new Date().getFullYear()} Alex’s Book Finder — Made with 💙 in React</small>
      </footer>
    </div>
  );
}

export default BookFinder;
