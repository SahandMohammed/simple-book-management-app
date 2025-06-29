import { useState, useEffect } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import SearchBooks from "./components/SearchBooks";
import { bookAPI, handleAPIError } from "./services/api";

function App() {
  // State management
  const [books, setBooks] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [editingBook, setEditingBook] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load books from API on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookAPI.getAllBooks();
      if (response.success) {
        setBooks(response.books);
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      setError(errorResult.error);
      console.error("Failed to load books:", error);
    } finally {
      setLoading(false);
    }
  };

  // RESTful Service: Add Book
  const addBook = async (bookData) => {
    try {
      const response = await bookAPI.createBook(bookData);
      if (response.success) {
        // Reload books to get updated list
        await loadBooks();
        setCurrentView("list");
        return { success: true, book: response.book };
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      return { success: false, error: errorResult.error };
    }
  };

  // Edit Book functionality
  const updateBook = async (updatedBook) => {
    try {
      const response = await bookAPI.updateBook(updatedBook.id, updatedBook);
      if (response.success) {
        // Reload books to get updated list
        await loadBooks();
        setEditingBook(null);
        setCurrentView("list");
        return { success: true, book: response.book };
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      alert("Error updating book: " + errorResult.error);
      return { success: false, error: errorResult.error };
    }
  };

  // Delete Book functionality
  const deleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await bookAPI.deleteBook(bookId);
        if (response.success) {
          // Reload books to get updated list
          await loadBooks();
        }
      } catch (error) {
        const errorResult = handleAPIError(error);
        alert("Error deleting book: " + errorResult.error);
      }
    }
  };

  // RESTful Service: Search Books
  const searchBooks = async (searchTerm) => {
    try {
      const response = await bookAPI.searchBooks(searchTerm);
      if (response.success) {
        setSearchResults(response.results);
        return { success: true, results: response.results };
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      return { success: false, error: errorResult.error };
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setCurrentView("add");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Book Management System</h1>
          <p className="text-blue-100 mt-2">
            Manage your book collection efficiently
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView("list")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              View Books
            </button>
            <button
              onClick={() => {
                setCurrentView("add");
                setEditingBook(null);
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === "add"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Add Book
            </button>
            <button
              onClick={() => setCurrentView("search")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Search Books
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Connection Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadBooks}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading books...</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {currentView === "list" && (
              <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={deleteBook}
              />
            )}
            {currentView === "add" && (
              <BookForm
                onSubmit={editingBook ? updateBook : addBook}
                editingBook={editingBook}
                onCancel={() => {
                  setCurrentView("list");
                  setEditingBook(null);
                }}
              />
            )}
            {currentView === "search" && (
              <SearchBooks
                onSearch={searchBooks}
                searchResults={searchResults}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
