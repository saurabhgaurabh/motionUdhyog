// index.js
const express = require('express');
const approute = require('./app');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(approute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);   
});

