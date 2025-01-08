# URL Shortener Microservice

A RESTful API service that shortens URLs using Node.js, Express, and MongoDB.

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- dotenv for environment variables
- DNS module for URL validation

## API Endpoints

### Create Short URL
- **Endpoint:** `POST /api/shorturl/new`
- **Body:** `{ "url": "https://www.example.com" }`
- **Response:**
```json
{
  "original_url": "https://www.example.com",
  "short_url": 1
}
```

### Access Short URL
- **Endpoint:** `GET /api/shorturl/:id`
- **Behavior:** Redirects to original URL
- **Error Response:**
```json
{
  "error": "No short URL found for the given input"
}
```

## Database Schema

```javascript
const urlSchema = new Schema({
  original_url: String,
  shorturl: Number
})
```

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB:
   - Create a MongoDB Atlas cluster
   - Set your MongoDB URI in environment variables:
```bash
export MONGO_URI='your_mongodb_uri'
```

4. Start the server:
```bash
npm start
```

## Environment Variables
Create a `.env` file in the root directory:
```bash
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_CLUSTER=your_cluster.mongodb.net
MONGO_DATABASE=your_database_name
PORT=3000
```

## Implementation Details

- **URL Validation**: Uses Node's built-in `URL` constructor and DNS lookup
- **Short URL Generation**: Random number between 1-10000
- **Error Handling**: Validates URLs and provides meaningful error messages
- **Caching**: Checks for existing URLs before creating new entries
- **Security**: Validates URL protocols (only HTTP/HTTPS)

## Error Responses

- Invalid URL format: `{ "error": "invalid url" }`
- Non-existent short URL: `{ "error": "No short URL found for the given input" }`
- Wrong format: `{ "error": "Wrong format" }`

## Development

Running in development mode:
```bash
PORT=3000 npm start
```

## License

MIT