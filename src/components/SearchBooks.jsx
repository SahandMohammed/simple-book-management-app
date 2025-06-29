import { useState } from 'react'

const SearchBooks = ({ onSearch, searchResults }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      alert('Please enter a search term')
      return
    }
    
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      await onSearch(searchTerm.trim())
    } catch (error) {
      alert('Search failed: ' + error.message)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setHasSearched(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Books</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {hasSearched && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Search Instructions */}
        {!hasSearched && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Search Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Search by book title (e.g., "Great Gatsby")</li>
              <li>• Search by author name (e.g., "Harper Lee")</li>
              <li>• Search by genre (e.g., "Fiction")</li>
              <li>• Search is case-insensitive and matches partial text</li>
            </ul>
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Search Results
            </h3>
            <span className="text-sm text-gray-600">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No books found</h4>
              <p className="text-gray-500">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((book) => (
                <SearchResultCard key={book.id} book={book} searchTerm={searchTerm} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const SearchResultCard = ({ book, searchTerm }) => {
  // Helper function to highlight search terms
  const highlightText = (text, term) => {
    if (!term) return text
    
    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-2">
        {highlightText(book.title, searchTerm)}
      </h4>
      
      <p className="text-gray-600 text-sm mb-2">
        <span className="font-medium">by</span> {highlightText(book.author, searchTerm)}
      </p>
      
      <div className="flex items-center justify-between mb-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {highlightText(book.genre, searchTerm)}
        </span>
        <span className="text-xs text-gray-500">
          {book.publicationYear}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm line-clamp-2">
        {book.description}
      </p>
    </div>
  )
}

export default SearchBooks
