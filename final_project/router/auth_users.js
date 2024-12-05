const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (usersWithSameName.length > 0) {
        return false;
    } else {
        return true;
    }
}

const getAuthenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validUser = users.find((user) => {
        return (user.username === username && user.password === password);
    });

    return validUser;
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = getAuthenticatedUser(username, password)

    if(!user) {
        return res.status(404).json({message: "No user found."})
    }

    let accessToken = jwt.sign({
        data: {
            username: username
        }
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const comment = req.body.comment;
    const rating = req.body.rating

    if(!comment || !rating || typeof(comment) !== "string" || typeof(rating) !== "number") {
        return res.status(400).json({message: "Invalid body."})
    }

    const isbn = req.params.isbn;
    const bookEntry = Object.entries(books).find(([key, book]) => book.isbn === isbn);

    if (!bookEntry) {
        return res.status(404).json({ message: "Book not found" });
    }

    const [key, book] = bookEntry;  // key is the key of the book, book is the book object

    const existingReviewIndex = book.reviews.findIndex((review) => review.username === req.user.data.username);

    if(existingReviewIndex === -1) {
        book.reviews.push({
            username: req.user.data.username,
            comment: comment,
            rating: rating
        })
    } else {
        book.reviews[existingReviewIndex] = {
            username: req.user.data.username,
            comment: comment,
            rating: rating
        }
    }

    books[key] = book;

    return res.status(200).json({message: "Successfully added review.", user: req.user})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from URL parameter
    const bookEntry = Object.entries(books).find(([key, book]) => book.isbn === isbn);

    if (!bookEntry) {
        return res.status(404).json({ message: "Book not found" });
    }

    const [key, book] = bookEntry;  // key is the key of the book, book is the book object

    // Find the index of the review by the current user
    const reviewIndex = book.reviews.findIndex((review) => review.username === req.user.data.username);

    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found or you are not the reviewer." });
    }

    // Remove the review from the array
    book.reviews.splice(reviewIndex, 1);

    books[key] = book;  // Update the book entry with the modified reviews

    return res.status(200).json({ message: "Review successfully deleted." });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
