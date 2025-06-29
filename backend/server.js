import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (replace with database in production)
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    publicationYear: 1925,
    description: "A classic American novel set in the Jazz Age.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    publicationYear: 1960,
    description: "A gripping tale of racial injustice and childhood innocence.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    publicationYear: 1949,
    description: "A dystopian social science fiction novel about totalitarian control.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 4;

// Validation middleware
const bookValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  
  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required')
    .isIn(['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Dystopian Fiction', 'Other'])
    .withMessage('Invalid genre'),
  
  body('publicationYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Publication year must be between 1000 and ${new Date().getFullYear()}`),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to find book by ID
const findBookById = (id) => {
  return books.find(book => book.id === parseInt(id));
};

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Book Management API is running',
    timestamp: new Date().toISOString()
  });
});

// GET /api/books - Get all books
app.get('/api/books', (req, res) => {
  try {
    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve books',
      error: error.message
    });
  }
});

// GET /api/books/:id - Get a specific book
app.get('/api/books/:id', (req, res) => {
  try {
    const book = findBookById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve book',
      error: error.message
    });
  }
});

// POST /api/books - Create a new book
app.post('/api/books', bookValidation, handleValidationErrors, (req, res) => {
  try {
    const { title, author, genre, publicationYear, description } = req.body;
    
    // Check if book with same title and author already exists
    const existingBook = books.find(book => 
      book.title.toLowerCase() === title.toLowerCase() && 
      book.author.toLowerCase() === author.toLowerCase()
    );
    
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'A book with this title and author already exists'
      });
    }
    
    const newBook = {
      id: nextId++,
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      publicationYear: parseInt(publicationYear),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    books.push(newBook);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message
    });
  }
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', bookValidation, handleValidationErrors, (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    const { title, author, genre, publicationYear, description } = req.body;
    
    // Check if another book with same title and author exists (excluding current book)
    const existingBook = books.find(book => 
      book.id !== parseInt(req.params.id) &&
      book.title.toLowerCase() === title.toLowerCase() && 
      book.author.toLowerCase() === author.toLowerCase()
    );
    
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'A book with this title and author already exists'
      });
    }
    
    const updatedBook = {
      ...books[bookIndex],
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      publicationYear: parseInt(publicationYear),
      description: description.trim(),
      updatedAt: new Date().toISOString()
    };
    
    books[bookIndex] = updatedBook;
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    const deletedBook = books.splice(bookIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    });
  }
});

// GET /api/books/search/:query - Search books
app.get('/api/books/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase().trim();
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const results = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      query: req.params.query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Book Management API server running on port ${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
