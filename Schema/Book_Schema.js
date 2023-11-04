const mongoose = require('mongoose')
const book_schema = new mongoose.Schema({
    Title:String,
    Author:String,
    ISBN :String,
    Description:String,
    Published_Date:String,
    UserID:String
})

const Book_Model = mongoose.model('Book',book_schema)
module.exports = {
    Book_Model
}