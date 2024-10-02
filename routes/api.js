/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {
  const Book = require('../models/library.js');
  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      try {
        const library = await Book.find({
          title: { $gt: "" }
        });
        const countComments = library.map(({ title, _id, comments }) => ({
          title: title,
          _id: _id,
          commentcount: comments.length
        }))
        res.send(countComments);
      }
      catch (error) {
        console.log({ error: error.message })
      }
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title || title === " ") {
        res.send('missing required field title')
      }
      try {
        const book = new Book({
          title: title
        });
        const result = await book.save();
        console.log(result);
        res.send({
          title: result.title,
          _id: result._id
        });

      }
      catch (error) {
        console.log({ error: error.message })
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        const result = await Book.deleteMany({title: {$gte: ""}});
        console. log(result);
        if (result) {
          res.send("complete delete successful")
        }

      }
      catch (error) {
        console. log({error: error.message})
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;

      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists")
        } else {
          res.send({
            title: book.title,
            _id: book._id,
            comments: book.comments
          })
        }
      }

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      catch (error) {
        console.log({ error: error.message })
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment || comment === " ") {
        res.send("missing required field comment")
      }
      //json res format same as .get

      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists")
        } else {
          book.comments.push(comment);
          await book.save();
          res.send({
            title: book.title,
            _id: book._id,
            comments: book.comments
          })
        }
      }
      catch (error) {
        console.log({ error: error.message })
      }
    })
    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const result = await Book.findByIdAndDelete(bookid);
        if (!result) {
          res.send("no book exists");
        }else {
          res.send("delete successful")
        }

      }
      catch (error) {
        console.log({ error: error.message })
      }
    });

};
