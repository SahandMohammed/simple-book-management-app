import { useState, useEffect } from 'react'

const BookForm = ({ onSubmit, editingBook, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publicationYear: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        publicationYear: editingBook.publicationYear.toString(),
        description: editingBook.description
      })
    }
  }, [editingBook])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required'
    }
    
    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required'
    }
    
    if (!formData.publicationYear) {
      newErrors.publicationYear = 'Publication year is required'
    } else if (isNaN(formData.publicationYear) || formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear()) {
      newErrors.publicationYear = 'Please enter a valid year'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const bookData = {
        ...formData,
        publicationYear: parseInt(formData.publicationYear)
      }
      
      if (editingBook) {
        bookData.id = editingBook.id
      }
      
      const result = await onSubmit(bookData)
      
      if (result.success) {
        // Reset form
        setFormData({
          title: '',
          author: '',
          genre: '',
          publicationYear: '',
          description: ''
        })
        setErrors({})
        
        if (!editingBook) {
          alert('Book added successfully!')
        } else {
          alert('Book updated successfully!')
        }
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter book title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Genre *
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.genre ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Dystopian Fiction">Dystopian Fiction</option>
              <option value="Other">Other</option>
            </select>
            {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
          </div>

          {/* Publication Year */}
          <div>
            <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-2">
              Publication Year *
            </label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.publicationYear ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter publication year"
            />
            {errors.publicationYear && <p className="mt-1 text-sm text-red-600">{errors.publicationYear}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter book description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookForm
