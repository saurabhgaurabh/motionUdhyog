const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');

// Your api's for post data.
routes.post('/udhyog_registration', userController.udhyog_registration);
routes.post('/motion_user_registration_routes', userController.motion_user_registration_routes);
routes.post('/motion_add_dealer_registration_routes',userController.motion_add_dealer_registration_routes);
routes.post('/motion_purchase_row_material_routes',userController.motion_purchase_row_material_routes);
routes.post('/motion_employee_registration_routes', userController.motion_employee_registration_routes);
routes.post('/motion_product_manufacturing_routes', userController.motion_product_manufacturing_routes);
routes.post('/motion_parties_registration_routes', userController.motion_parties_registration_routes);
routes.post('/motion_dispatch_product_routes', userController.motion_dispatch_product_routes);

module.exports = routes; 




