const express = require('express')
require('dotenv').config();
const { default: mongoose } = require('mongoose')
const app = express()
const port = 3000

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/expenses'))

mongoDBUri = process.env.DBURI;

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(app.listen(port, () => console.log(`Connected to database and listening on localhost:${port}!`)))
.catch(err => console.error('Error while connecting.', err))
