const mongoose = require ('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    comments: []
});
const Book = mongoose.model('Book', BookSchema);

module.exports = Book;