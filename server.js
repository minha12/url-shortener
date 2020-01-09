'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser')

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//////////////////////My app started here////////////////////
process.env.MONGO_URI = 'mongodb+srv://minhha-db:minhha89@cluster0-7zk5p.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if(!err) {
    console.log('Successfully connect to MongoDB ...')
  }
})

const Schema = mongoose.Schema
const urlSchema = new Schema({
  original_url: String,
  shorturl: Number
})
const URLCollection = mongoose.model('URLCollection', urlSchema)


//Post a new URL
app.post('/api/shorturl/new', function(req, res) {
  const originalUrl = req.body.url
  console.log(originalUrl)
  const randomNumber = Math.floor(Math.random() * 10000 + 1)
  URLCollection.findOne({originalUrl: originalUrl}, (err, data) => {
    if(err) return err
    if(data) {
      res.send(data)
    } else {
      console.log('Creating new an url entry for ' + originalUrl)
      var newEntry = new URLCollection({originalUrl: originalUrl, shorturl: randomNumber})
      newEntry.save((err, data) => {
        if(err) return err
        res.send(data)
      })
    }
  })
})
/////////////////////////////////////////////////////////////

app.listen(port, function () {
  console.log('Node.js listening ...');
});