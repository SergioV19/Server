const express = require('express')
const app = express()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
app.use(express.json())
const cors = require('cors')
app.use(cors({
    origin:'*'
}));
const routes = require('./routes')
const PORT = process.env.PORT || 3200;



//route
app.get('/', (req, res) => {
    res.send('Welcome to my APIREST')
})

app.use('/api', routes)

//Runnig
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
}) 