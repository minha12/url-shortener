'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var dns = require('dns')

var cors = require('cors');

var app = express();

// Add these lines after creating the express app
app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/views');

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
process.env.MONGO_URI = 'mongodb+srv://minhhax89:ND2GKcDkLjLICZZj@cluster0.igp03.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  dbName: 'urlshortener'
}).then(() => {
  console.log('Successfully connected to MongoDB...');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const Schema = mongoose.Schema
const urlSchema = new Schema({
  original_url: String,
  shorturl: Number
})
const URLCollection = mongoose.model('URLCollection', urlSchema)


//Post a new URL
app.post('/api/shorturl/new', function(req, res) {
  const originalUrl = req.body.url
  
  // Use URL constructor for validation
  try {
    const urlObj = new URL(originalUrl);
    if (!urlObj.protocol.startsWith('http')) {
      return res.json({ error: 'invalid url' });
    }
    
    dns.lookup(urlObj.hostname, (err) => {
      if(err) {
        return res.json({ error: 'invalid url' })
      }
      
      const randomNumber = Math.floor(Math.random() * 10000 + 1)
      
      URLCollection.findOne({ original_url: originalUrl }, (err, data) => {
        if(err) return res.json({ error: 'Server Error' })
        if(data) {
          return res.json({
            original_url: data.original_url,
            short_url: data.shorturl
          })
        }
        
        const newEntry = new URLCollection({
          original_url: originalUrl,
          shorturl: randomNumber
        })
        
        newEntry.save((err, data) => {
          if(err) return res.json({ error: 'Server Error' })
          return res.json({
            original_url: data.original_url,
            short_url: data.shorturl
          })
        })
      })
    })
  } catch {
    return res.json({ error: 'invalid url' })
  }
})

//Visit the shortened URL
app.get('/api/shorturl/:shortId', (req, res) => {
  const shortId = parseInt(req.params.shortId)
  
  if(isNaN(shortId)) {
    return res.json({ error: 'Wrong format' })
  }

  URLCollection.findOne({ shorturl: shortId }, (err, data) => {
    if(err || !data) {
      return res.json({ error: 'No short URL found for the given input' })
    }
    res.redirect(data.original_url)
  })
})
/////////////////////////////////////////////////////////////

app.listen(port, function () {
  console.log('Node.js listening ...');
});