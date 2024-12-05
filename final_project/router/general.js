const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. You can log in now"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    } else {
        return res.status(404).json({message: "Missing user or password"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
// console.log("Books data:", books);
//   const isbn = req.params.isbn
//   const book = books.find((b) => b.isbn === isbn);

//   if (book) {
//     res.json(book);
//   } else {
//     res.status(404).json({ message: "Book not found"});
//   }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    const author = req.params.author.toLocaleLowerCase();
    const booksByAuthor = Object.values(books).filter((book) => {
        return book.author.toLocaleLowerCase() === author;
    })

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({message: "No books found for this author"})
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title.toLocaleLowerCase();
    const booksByTitle = Object.values(books).filter((book) => {
        return book.title.toLocaleLowerCase() === title;
    })

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found for this title"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
