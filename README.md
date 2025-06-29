# 📚 Book Management System

A full-stack app to manage your book collection with add, view, edit, delete, and search features.

## ✨ Features

- Add, view, edit, delete books
- Search by title, author, or genre
- Responsive React + Tailwind CSS UI

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Helmet, CORS, Morgan

## 🚀 Getting Started

1. **Clone the repo**:

```bash
git clone <repo-url>
cd asgmt-2
```

2. **Install dependencies**:

```bash
npm install        # Frontend
cd backend && npm install && cd ..  # Backend
```

3. **Run servers** (2 terminals):

```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
npm run dev
```

4. **Visit the app**: [http://localhost:5173](http://localhost:5173)

## 📦 API Endpoints

- `GET /api/books` - List all books
- `POST /api/books` - Add a book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/books/search?q=` - Search books

## 📂 Project Structure

- `/src` - React frontend
- `/backend` - Express backend

## ⚠ Troubleshooting

- Port issues? Check ports 5173 (frontend), 3001 (backend)
- Clear `node_modules` and reinstall if errors

## 🧠 Notes

- Uses in-memory storage.
