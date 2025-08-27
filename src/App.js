import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data.docs.slice(0, 20)); // Limit to 20 results
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchBooks();
    }
  };

  return (
    <div className="app-container">
      <h1>Book Finder</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter book title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="books-list">
        {books.length === 0 && !loading && !error && <p>No results found.</p>}
        {books.map((book) => (
          <div key={book.key} className="book-item">
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={`${book.title} cover`}
              />
            ) : (
              <div className="no-cover">No Cover</div>
            )}
            <div className="book-info">
              <h2>{book.title}</h2>
              <p><strong>Author:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
              <p><strong>First Published:</strong> {book.first_publish_year || 'N/A'}</p>
              <p><strong>Publisher:</strong> {book.publisher ? book.publisher[0] : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
