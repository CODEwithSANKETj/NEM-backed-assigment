const express = require('express')
const user_route = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { user_model } = require('../Schema/User_Schema')

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User Created Successfully
 *       401:
 *         description: Error in registration process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Invalid Body
 */


user_route.post('/register', (req,res)=>{
    const {email,password,age} = req.body
    if(email&&password&&age){
        try{
            bcrypt.hash(password, 3,async function(err, hash) {
                if(err){
                    return res.status(401).send({err:err})
                }
               
                const new_user = new user_model({
                    email:email,password:hash,age:age
                })
                await new_user.save()
                return res.status(201).send('User Created Succesfully')
            });
        }
        catch(err){
            return res.status(401).send({err:err})
        }
    }
    else{
        return res.status(401).send("Invalid Body")
    }
})


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate a user by login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating a successful login.
 *                 token:
 *                   type: string
 *                   description: Authentication token for the user.
 *       401:
 *         description: User authentication failed due to incorrect email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Incorrect email or password
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: No user found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 */


user_route.post('/login',async(req,res)=>{
    const {email,password} = req.body
    if(email&&password){
        try{
            const find_user = await user_model.findOne({ email: email })
           

            if(!find_user){
                return res.status(401).send('NO user found')
            }

            bcrypt.compare(password, find_user.password, function(err, result) {
                if(err){
                    return res.status(401).send({err:err})
                }
                if(!result){
                    return res.status(401).send('Incorrect Password')
                }
                const token = jwt.sign({UserID:find_user._id},'sanket')
                return res.status(401).send({msg:"Loign Successfull",token:token})
            });
        
        }
        catch(err){
            return res.status(401).send({err:err})
        }
    }
    else{
        return res.status(401).send("Invalid Body")
    }
})



module.exports = {
    user_route
}