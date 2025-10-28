import React, { useState, useEffect } from "react";
import sampleData from "../data/sampleData";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      console.error(err);
      alert("Could not fetch from API. Try sample data instead.");
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
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">📚 Alex’s Book Finder</span>
          <div className="d-flex">
            <button
              className="btn btn-light btn-sm me-2"
              onClick={() => window.location.reload()}
            >
              Home
            </button>
            <button
              className="btn btn-outline-light btn-sm me-2"
              onClick={() => alert(`Profile: ${localStorage.getItem("alex_user")}`)}
            >
              Profile
            </button>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container py-4 flex-grow-1">
        <h4 className="mb-3">Welcome, {localStorage.getItem("alex_user")} 👋</h4>
        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Search for a book title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="sampleCheck"
              checked={useSample}
              onChange={(e) => setUseSample(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="sampleCheck">
              Use sample data (demo)
            </label>
          </div>
        </form>

        {/* Books Grid */}
        <div className="row">
          {books.length === 0 && (
            <div className="col-12 text-center text-muted">
              <p>No results found.</p>
            </div>
          )}
          {books.map((book, idx) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={idx}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={getCover(book.cover_i)}
                  className="card-img-top"
                  alt={book.title}
                  style={{ height: 260, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{book.title}</h6>
                  <p className="text-muted mb-2">
                    {book.author_name ? book.author_name.join(", ") : "Unknown"}
                  </p>
                  <small className="text-muted mt-auto">
                    First published: {book.first_publish_year || "N/A"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-auto border-top">
        <small className="text-muted">
          © {new Date().getFullYear()} Alex’s Book Finder | Built with ❤️ using React + Bootstrap
        </small>
      </footer>
    </div>
  );
}

export default BookFinder;
