const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Check if username or password missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check if user already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate an async call (in real apps you would fetch from DB)
    const allBooks = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).json(JSON.stringify(allBooks, null, 2));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    return res.status(200).json(JSON.stringify(book, null, 2));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const result = await new Promise((resolve) => {
      const allBooks = Object.values(books).filter(b => b.author.toLowerCase() === author);
      resolve(allBooks);
    });
    return res.status(200).json(JSON.stringify(result, null, 2));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const result = await new Promise((resolve) => {
      const allBooks = Object.values(books).filter(b => b.title.toLowerCase() === title);
      resolve(allBooks);
    });
    return res.status(200).json(JSON.stringify(result, null, 2));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
