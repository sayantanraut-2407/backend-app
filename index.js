const express = require('express')
const app = express()
const cors = require('cors');
const port = 3001

const drug_model = require('./drugFetch')

const fs = require("fs");
const bodyParser = require('body-parser');
const json2csv = require('json-2-csv');
const path = require('path');

app.use(express.json());

app.use(bodyParser.json());

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/getDrugs', (req, res) => {
    drug_model.getDrugs()
    .then(response => {
        res.status(200).send(response);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error);
    })
})

app.get('/getDrugData', (req, res) => {
  drug_model.getDrugData()
  .then(response => {
      res.status(200).send(response);
  })
  .catch(error => {
      console.log(error)
      res.status(500).send(error);
  })
})

app.get('/getViabilityAndMappingData', (req, res) => {
  drug_model.getViabilityAndMappingData()
  .then(response => {
    const textData = JSON.stringify(response, null, 2);
    // fs.writeFile('res.json', textData, (err) => {
    //     if (err) {
    //         console.error('Error writing file', err);
    //         res.status(500).send('Error writing file');
    //         return;
    //     }
    //     console.log('File has been saved');
    // });
    // try {
    //   const csv = json2csv.json2csv(response);
    //   const filePath = path.join(__dirname, 'drugs_viability_data.csv');
  
    //   fs.writeFileSync(filePath, csv);
    // } catch (err) {
    //   console.error('Error converting to CSV:', err);
    //   res.status(500).send({ message: 'Error saving CSV file' });
    // }

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