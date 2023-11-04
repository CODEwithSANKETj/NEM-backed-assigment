const express = require('express')
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { connection } = require('./db')
const { Book_route } = require('./Routes/Book');
const { user_route } = require('./Routes/user');
const app = express()
app.use(cors())
app.use(express.json())
app.use('/books',Book_route)
app.use('/user',user_route)
//////swagger/////////
let options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Swagger Documentation",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:4040"
            }
        ]
    },
    apis: ["./Routes/*.js"]
};


const swaggerSpec = swaggerJSDoc(options)
app.use('/api_docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
//////////////////////




app.get('/',(req,res)=>{
    res.send('hiii')
})

app.listen(4040,()=>{
    console.log('running on 4040');
})