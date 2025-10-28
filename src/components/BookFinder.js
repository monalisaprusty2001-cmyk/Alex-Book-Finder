import React, { useState, useEffect } from "react";
import sampleData from "../data/sampleData";
import { useNavigate } from "react-router-dom";
import "./BookFinder.css"; // 👈 we’ll create this next

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
    if (e) e.preventDefault();
    if (!query.trim() && !useSample) {
      alert("Please enter a book title to search (or check 'Use sample data').");
      return;
    }

    if (useSample) {
      setBooks(sampleData.docs);
      return;
    }

    setLoading(true);
    try {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data. Try again or use sample data.");
    } finally {
      setLoading(false);
    }
  };

  const getCover = (cover_i) => {
    return cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
      : "https://via.placeholder.com/180x260?text=No+Cover";
  };

  return (
    <div className="book-page">
      <nav className="navbar navbar-light bg-transparent px-4 py-3">
        <h3 className="text-light mb-0 fw-bold">📚 Alex’s Book Finder</h3>
        <div>
          <button
            className="btn btn-outline-light me-2"
            onClick={() => {
              setQuery("");
              setBooks([]);
            }}
          >
            Clear
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <h4 className="text-center text-white">
          Welcome, <span className="fw-bold">{localStorage.getItem("alex_user")}</span> 👋
        </h4>
        <p className="text-center text-light mb-4">
          Search any book title using the Open Library API
        </p>

        <form
          onSubmit={handleSearch}
          className="d-flex justify-content-center align-items-center mb-4"
        >
          <div className="input-group w-75">
            <input
              className="form-control form-control-lg rounded-start"
              placeholder="🔍 Search for a book title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary btn-lg" type="submit">
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        <div className="form-check text-center mb-5">
          <input
            className="form-check-input"
            type="checkbox"
            id="sampleCheck"
            checked={useSample}
            onChange={(e) => setUseSample(e.target.checked)}
          />
          <label className="form-check-label text-white" htmlFor="sampleCheck">
            Use sample data (demo)
          </label>
        </div>

        <div className="row">
          {books.length === 0 && (
            <div className="col-12 text-center text-light">
              <p>No results to show. Try searching something!</p>
            </div>
          )}

          {books.map((book, idx) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={idx}>
              <div className="book-card h-100">
                <img
                  src={getCover(book.cover_i)}
                  className="card-img-top"
                  alt={book.title}
                />
                <div className="book-info">
                  <h6>{book.title}</h6>
                  <p className="text-muted small mb-1">
                    {book.author_name ? book.author_name.join(", ") : "Unknown"}
                  </p>
                  <small className="text-secondary">
                    First published: {book.first_publish_year || "N/A"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookFinder;
