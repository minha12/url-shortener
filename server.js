'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var dns = require('dns')

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
  const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
  const removedProtocolUrl = originalUrl.replace(/^https?\:\/\//i,'')
  const domainOnly = removedProtocolUrl.match( /^(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/i )
  const validUrl = originalUrl.match(urlRegex)
  console.log(validUrl)
  const randomNumber = Math.floor(Math.random() * 10000 + 1)
  
  if(validUrl){
    dns.lookup(domainOnly[0], err => {
      if(err) {
        res.send('Invalid URL')
      } else{
        URLCollection.findOne({original_url: validUrl}, (err, data) => {
          if(err) return err
          if(data) {
            console.log('The given URL is available in database')
            res.send(data)
          } else {
            console.log('Creating new an url entry for ' + originalUrl)
            var newEntry = new URLCollection({original_url: validUrl, shorturl: randomNumber})
            newEntry.save((err, data) => {
              if(err) return err
              res.send(data)
            })
          }
        })
      }
    })
  }
  
})


/////////////////////////////////////////////////////////////

app.listen(port, function () {
  console.log('Node.js listening ...');
});