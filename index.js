// index.js
const express = require('express');
const approute = require('./app');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sample route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to the API' });
// });

app.use(approute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

