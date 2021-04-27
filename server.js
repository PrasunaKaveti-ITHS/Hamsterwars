const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const hamsters = require('./routes/hamsters.js')

const PORT = 1320
const staticFolder = path.join(__dirname, 'static')

// Middleware
// Logger - skriv ut info om inkommande request
app.use((req, res, next) => {
    console.log(`${req.method}  ${req.url} `, req.params);
    next()
})

app.use(express.json())
app.use(cors())
app.use(express.static(staticFolder))

// Routes

app.get('/',(req,res) => {
    res.send('Firestore project')
})
// REST API for /hamsters
app.use('/hamsters', hamsters)

// Starta servern
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})