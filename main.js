
const { isAllowed } = require('./rateLimiter'); // Assuming isAllowed is implemented in rateLimiter.js
const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app flow
// /take -> isAllowed (rateLimiter.js) which inits token buckets for all endpoints in config
// token buckets created with createTokenBucket in tokenBucket.js (scheds the refills too here)
// take function called in tokenBucket after created which deducts token and returns accept/reject
// passed back up along stream to /take call

// 5. Exposes a single endpoint at /take/, which receives the route template to check the rate limit 
// for from the caller via query string, route params or body.
app.post('/take', (req, res) => {
  const { endpoint } = req.query; // we'll use query (?endpoint=xxxxx)
  if (!endpoint) return res.status(400).json({error: 'Bad request - endpoint query param required'});
    
  // check if request has tokens available
  const { accepted, remainingTokens } = isAllowed(endpoint); 
  const response = accepted
    ? { message: 'Request Accepted', remainingTokens }
    : { error: 'Rate limit exceeded', remainingTokens };
      
    // 200 if succes with accepted -> success msg
    // 401 if err -> err msg
  console.log(response);
  res.status(accepted ? 200 : 401).json(response); 
})

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`)
})

module.exports = app;