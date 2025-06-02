const express = require('express');
const approute = express();
const userRoutes = require('./routes/userRoutes');

approute.use(express.json());
approute.use('/api/users', userRoutes);

module.exports = approute;

