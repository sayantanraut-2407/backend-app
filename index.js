const express = require('express')
const app = express()
const port = 3001

const drug_model = require('./drugFetch')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/getDrugs', (req, res) => {
    drug_model.getDrugs()
    .then(response => {
        console.log(response)
        res.status(200).send(response);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error);
    })
})

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})