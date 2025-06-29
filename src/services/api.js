// API service for Book Management System
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Book API functions
export const bookAPI = {
  // Get all books
  getAllBooks: async () => {
    const response = await apiRequest('/books');
    return {
      success: true,
      books: response.data
    };
  },

  // Get a single book by ID
  getBookById: async (id) => {
    const response = await apiRequest(`/books/${id}`);
    return {
      success: true,
      book: response.data
    };
  },

  // Create a new book (RESTful Service)
  createBook: async (bookData) => {
    const response = await apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    return {
      success: true,
      book: response.data,
      message: response.message
    };
  },

  // Update an existing book
  updateBook: async (id, bookData) => {
    const response = await apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    return {
      success: true,
      book: response.data,
      message: response.message
    };
  },

  // Delete a book
  deleteBook: async (id) => {
    const response = await apiRequest(`/books/${id}`, {
      method: 'DELETE',
    });
    return {
      success: true,
      book: response.data,
      message: response.message
    };
  },

  // Search books (RESTful Service)
  searchBooks: async (query) => {
    if (!query || !query.trim()) {
      throw new Error('Search query is required');
    }
    
    const response = await apiRequest(`/books/search/${encodeURIComponent(query.trim())}`);
    return {
      success: true,
      results: response.data,
      count: response.count,
      query: response.query
    };
  },

  // Health check
  healthCheck: async () => {
    const response = await apiRequest('/health');
    return response;
  }
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      success: false,
      error: 'Unable to connect to the server. Please make sure the backend is running.'
    };
  }
  
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};

export default bookAPI;
