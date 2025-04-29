const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');

// Your api's 
// routes.post('/udhyog_registration', userController.udhyog_registration);
routes.post('/udhyog_registration', userController.udhyog_registration);

module.exports = routes;