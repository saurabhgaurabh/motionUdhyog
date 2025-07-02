// index.js
const express = require('express');
const approute = require('./app');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(approute)

app.use((req, res) => {
  res.status(404).json({ message: 'Bhai tu kuch galat kar raha hai. (Bad Request...)' });
})
app.listen(PORT, () => {
  console.log(`Server has been activated via port no. ${PORT}`);
});

