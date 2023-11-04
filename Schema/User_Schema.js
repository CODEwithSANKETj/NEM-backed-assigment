const mongoose = require('mongoose')
const User_Schema = new mongoose.Schema({
    email:String,
    age:Number,
    password:String
})

const user_model = mongoose.model('User',User_Schema)

module.exports = {
    user_model
}