const BookList = ({ books, onEdit, onDelete }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-500">Start by adding your first book to the collection.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Book Collection</h2>
        <div className="text-sm text-gray-600">
          Total: {books.length} book{books.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Book Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        {/* Author */}
        <p className="text-gray-600 mb-2">
          <span className="font-medium">by</span> {book.author}
        </p>
        
        {/* Genre and Year */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {book.genre}
          </span>
          <span className="text-sm text-gray-500">
            {book.publicationYear}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {book.description}
        </p>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(book)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookList
