function isValidDate(date) {
    
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }
  
  function Book_validator(req, res, next) {
    const { Title, Author, ISBN, Description, Published_Date } = req.body;
  
    
    const isbnPattern = /^(?:\d{10}|\d{13})$/;
  
    if (Title && Author && Description && Published_Date && isbnPattern.test(ISBN) && isValidDate(Published_Date)) {
      return next();
    }
  
    return res.status(500).send('Invalid Body');
  }
  
  
module.exports = {

    Book_validator
}