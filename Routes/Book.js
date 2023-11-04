const express = require('express')
const { Book_Model } = require('../Schema/Book_Schema')
const { Book_validator } = require('../MIddlewear/Book_validator')
const { User_Auth_middlewear } = require('../MIddlewear/User_Auth')

const Book_route = express.Router()

/**
 * @swagger
 * /books/add_book:
 *   post:
 *     summary: Add a book to the database.
 *     security:
 *       - ApiKeyAuth: []  # Add this to specify the requirement for an "Authorization" header with the token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               Description:
 *                 type: string
 *               Published_Date:
 *                 type: string
 *               UserID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added Book Data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the book was added.
 */


Book_route.post('/add_book',Book_validator,User_Auth_middlewear,async(req,res)=>{

    const {Title,Author,ISBN,Description,Published_Date,UserID} = req.body
    
    try{
        const new_book = new Book_Model({
            Title,Author,ISBN,Description,Published_Date,UserID
        })
        await new_book.save()
        res.status(201).send('Book added')
    }
    catch(err){
        res.status(500).send({err:err})
    }
})
/**
 * @swagger
 * /books/read_book:
 *   get:
 *     summary: Retrieve books based on title and author filters.
 *     parameters:
 *       - in: query
 *         name: Title
 *         schema:
 *           type: string
 *         description: Filter books by title (case-insensitive).
 *       - in: query
 *         name: Author
 *         schema:
 *           type: string
 *         description: Filter books by author (case-insensitive).
 *     responses:
 *       200:
 *         description: Books retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The book's unique identifier.
 *                   Title:
 *                     type: string
 *                     description: The title of the book.
 *                   Author:
 *                     type: string
 *                     description: The author of the book.
 *                   ISBN:
 *                     type: string
 *                     description: The ISBN of the book.
 *                   Description:
 *                     type: string
 *                     description: The book's description.
 *                   Published_Date:
 *                     type: string
 *                     description: The published date of the book.
 *       404:
 *         description: No books found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: No books found
 *       500:
 *         description: Internal server error.
 */


Book_route.get('/read_book', async (req, res) => {
    const { Title, Author } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      let pipeline = [];
  
      if (Title) {
        pipeline.push({ $match: { Title: { $regex: Title, $options: 'i' } }})
      }
  
      if (Author) {
        pipeline.push({ $match: { Author: { $regex: Author, $options: 'i' } }});
      }
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });

      if (pipeline.length > 0) {
        const all_books = await Book_Model.aggregate(pipeline);
  
        if (all_books.length === 0) {
          return res.status(404).send('No books found');
        }
  
        return res.status(200).send(all_books);
      } else {
        const all_books = await Book_Model.find();
  
        if (all_books.length === 0) {
          return res.status(404).send('No books found');
        }
  
        return res.status(200).send(all_books);
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  })

  /**
 * @swagger
 * /books/read_book/{id}:
 *   get:
 *     summary: Retrieve a book by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the book.
 *     responses:
 *       201:
 *         description: Book retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The book's unique identifier.
 *                 Title:
 *                   type: string
 *                   description: The title of the book.
 *                 Author:
 *                   type: string
 *                   description: The author of the book.
 *                 ISBN:
 *                   type: string
 *                   description: The ISBN of the book.
 *                 Description:
 *                   type: string
 *                   description: The book's description.
 *                 Published_Date:
 *                   type: string
 *                   description: The published date of the book.
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: No book found
 *       500:
 *         description: Internal server error.
 */


Book_route.get('/read_book/:id',async(req,res)=>{
    const id = req.params.id
    try{
        const all_book  = await Book_Model.findById(id)
        if(!all_book){

            return res.status(501).send('NO book found')
        }
        return res.status(201).send(all_book)
    }
    catch(err){

        res.status(500).send({err:err})
    }
})

/**
 * @swagger
 * /books/update_book/{id}:
 *   patch:
 *     summary: Update a book by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the book to update.
 *     security:
 *       - ApiKeyAuth: []  # Add this to specify the requirement for an "Authorization" header with the token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               Description:
 *                 type: string
 *               Published_Date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The book's unique identifier.
 *                 Title:
 *                   type: string
 *                   description: The updated title of the book.
 *                 Author:
 *                   type: string
 *                   description: The updated author of the book.
 *                 ISBN:
 *                   type: string
 *                   description: The updated ISBN of the book.
 *                 Description:
 *                   type: string
 *                   description: The updated description of the book.
 *                 Published_Date:
 *                   type: string
 *                   description: The updated published date of the book.
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: No book found
 *       500:
 *         description: Internal server error.
 */


Book_route.patch('/update_book/:id',Book_validator,User_Auth_middlewear,async(req,res)=>{
    const id = req.params.id

    try{
        const {Title,Author,ISBN,Description,Published_Date,UserID} = req.body
        const bookToUpdate = await Book_Model.findById(id);
        if(!bookToUpdate){

            return res.status(501).send('NO book found')
        }
       // console.log(bookToUpdate.UserID.toString() , UserID,bookToUpdate.UserID.toString() === UserID);
        if (bookToUpdate.UserID.toString() !== UserID) {
            return res.status(401).send('Unauthorized: User is not authorized to update this book');
        }


        let update ={Title,Author,ISBN,Description,Published_Date,UserID}

        const all_book  = await Book_Model.findByIdAndUpdate(id,update,{new:true})
        if(!all_book){

            return res.status(501).send('NO book found')
        }
        return res.status(201).send(all_book)
    }
    catch(err){

        res.status(500).send({err:err})
    }
})

/**
 * @swagger
 * /books/delete_book/{id}:
 *   delete:
 *     summary: Delete a book by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the book to delete.
 *     security:
 *       - ApiKeyAuth: []  # Add this to specify the requirement for an "Authorization" header with the token
 *     responses:
 *       201:
 *         description: Book deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The book's unique identifier.
 *                 message:
 *                   type: string
 *                   description: Message indicating that the book was deleted.
 *                   example: Book Deleted
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: No book found
 *       500:
 *         description: Internal server error.
 */


Book_route.delete('/delete_book/:id',User_Auth_middlewear,async(req,res)=>{
    const id = req.params.id
    const {UserID} = req.body
    try{
        const bookToDelete = await Book_Model.findById(id);
        if(!bookToDelete){

            return res.status(501).send('NO book found')
        }
       // console.log(bookToUpdate.UserID.toString() , UserID,bookToUpdate.UserID.toString() === UserID);
        if (bookToDelete.UserID.toString() !== UserID) {
            return res.status(401).send('Unauthorized: User is not authorized to update this book');
        }
       
        const all_book  = await Book_Model.findByIdAndDelete(id)
        if(!all_book){

            return res.status(501).send('NO book found')
        }
        return res.status(201).send(all_book,"Book Deleted")
    }
    catch(err){

        res.status(500).send({err:err})
    }
})

module.exports = {
    Book_route
}

