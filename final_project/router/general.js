const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (isValid(username)) {
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
//   res.json(books);
//   //return res.status(300).json({message: "Yet to be implemented"});
    axios.get('https://barbarabania-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/').then((response) => {
        res.json(response.data);
    }).catch((error) => {
        res.status(404).json({message: "Error fetching books", error: error.message})
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
//   const isbn = req.params.isbn
//   const book = Object.values(books).find((book) => book.isbn === isbn);

//   if (book) {
//     res.json(book);
//   } else {
//     res.status(404).json({ message: "Book not found"});
//   }
    try {
        const isbn = req.params.isbn;

        // Simulate an external API call to fetch book details
        const response = await axios.get(`https://barbarabania-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        const books = response.data; // Assuming the API returns all books as JSON
        const book = Object.values(books).find((book) => book.isbn === isbn);

        if (book) {
        res.json(book);
        } else {
        res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  
    // const author = req.params.author.toLocaleLowerCase();
    // const booksByAuthor = Object.values(books).filter((book) => {
    //     return book.author.toLocaleLowerCase() === author;
    // })

    // if (booksByAuthor.length > 0) {
    //     res.json(booksByAuthor);
    // } else {
    //     res.status(404).json({message: "No books found for this author"})
    // }

    try {
        const author = req.params.author.toLowerCase();

        // Simulate an external API call
        const response = await axios.get('https://barbarabania-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
        const books = response.data; // Assuming the API returns all books as JSON

        const booksByAuthor = Object.values(books).filter((book) => {
            return book.author.toLowerCase() === author;
        });

        if (booksByAuthor.length > 0) {
            res.json(booksByAuthor);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  
    // const title = req.params.title.toLocaleLowerCase();
    // const booksByTitle = Object.values(books).filter((book) => {
    //     return book.title.toLocaleLowerCase() === title;
    // })

    // if (booksByTitle.length > 0) {
    //     res.json(booksByTitle);
    // } else {
    //     res.status(404).json({ message: "No books found for this title"})
    // }

    try {
        const title = req.params.title.toLowerCase();

        // Simulate an external API call
        const response = await axios.get('https://barbarabania-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
        const books = response.data; // Assuming the API returns all books as JSON

        const booksByTitle = Object.values(books).filter((book) => {
            return book.title.toLowerCase() === title;
        });

        if (booksByTitle.length > 0) {
            res.json(booksByTitle);
        } else {
            res.status(404).json({ message: "No books found for this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = Object.values(books).find((book) => book.isbn === isbn);

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found"});
  }
});

module.exports.general = public_users;
