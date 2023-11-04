const mongoose = require('mongoose')
require('dotenv').config();
const connection  = mongoose.connect(process.env.MONGOURL)
if(connection){
    console.log('connected to DB');
}
else{
    console.log('not connected');
}
module.exports = {
    connection
}