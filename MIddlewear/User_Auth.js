const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
function User_Auth_middlewear(req,res,next){
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
    jwt.verify(token,'sanket',(err,decoded)=>{
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
          }
        req.body.UserID = decoded.UserID
       
        next() 
    })
}
module.exports={
    User_Auth_middlewear
}