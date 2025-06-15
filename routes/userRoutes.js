const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const getController = require('../controller/getController');
const updateController = require('../controller/updateController');


// Your api's for post data.
 /* NOT GET*/ routes.post('/motion_user_registration_routes', userController.motion_user_registration_routes); // User Registration
routes.post('/motion_add_dealer_registration_routes', userController.motion_add_dealer_registration_routes); // Add Dealer Registration       
routes.post('/motion_purchase_row_material_routes', userController.motion_purchase_row_material_routes); // Purchase Row Material             
routes.post('/motion_employee_registration_routes', userController.motion_employee_registration_routes); // Employee Registration
routes.post('/motion_product_manufacturing_routes', userController.motion_product_manufacturing_routes); // Product Manufacturing
routes.post('/motion_parties_registration_routes', userController.motion_parties_registration_routes); // Parties Registration
routes.post('/motion_dispatch_product_routes', userController.motion_dispatch_product_routes); // Dispatch Product
routes.post('/motion_product_category_routes', userController.motion_product_category_routes); // Product Category
routes.post('/motion_product_subcategories_routes', userController.motion_product_subcategories_routes); // Product Subcategories
routes.post('/motion_product_sub_subcategories_routes', userController.motion_product_sub_subcategories_routes); // Product Sub Subcategories
routes.post('/motion_products_routes', userController.motion_products_routes); // Products optionals

// Your api's for get data.
routes.get('/motion_add_dealer_registration_get_routes', getController.motion_add_dealer_registration_get_routes);
routes.get('/motion_purchase_row_material_get_routes', getController.motion_purchase_row_material_get_routes);
routes.get('/motion_employee_registration_get_routes', getController.motion_employee_registration_get_routes);
routes.get('/motion_product_manufacturing_get_routes', getController.motion_product_manufacturing_get_routes);
routes.get('/motion_parties_registration_get_routes', getController.motion_parties_registration_get_routes);
routes.get('/motion_dispatch_product_get_routes', getController.motion_dispatch_product_get_routes);
routes.get('/motion_product_category_get_routes', getController.motion_product_category_get_routes);
routes.get('/motion_product_subcategories_get_routes', getController.motion_product_subcategories_get_routes);
routes.get('/motion_product_sub_subcategories_get_routes', getController.motion_product_sub_subcategories_get_routes);
routes.get('/motion_products_get_routes', getController.motion_products_get_routes);

 


// Your api's for Update data.
// routes.post('/motion_add_dealer_registration_routes_update', updateController.motion_add_dealer_registration_routes_update);
// In routes.js or your route file
routes.post('/update_dealer_registration', updateController.update_dealer_registration);
// routes.post('/motion_purchase_row_material_update', updateController.motion_purchase_row_material_update);


module.exports = routes;