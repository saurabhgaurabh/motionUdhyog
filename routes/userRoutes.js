const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const getController = require('../controller/getController');

// Your api's for post data.
routes.post('/udhyog_registration', userController.udhyog_registration); // Udhyog Registration
routes.post('/motion_user_registration_routes', userController.motion_user_registration_routes); // User Registration
 /*GET*/ routes.post('/motion_add_dealer_registration_routes', userController.motion_add_dealer_registration_routes); // Add Dealer Registration       
 /*GET*/ routes.post('/motion_purchase_row_material_routes', userController.motion_purchase_row_material_routes); // Purchase Row Material             
routes.post('/motion_employee_registration_routes', userController.motion_employee_registration_routes); // Employee Registration
routes.post('/motion_product_manufacturing_routes', userController.motion_product_manufacturing_routes); // Product Manufacturing
routes.post('/motion_parties_registration_routes', userController.motion_parties_registration_routes); // Parties Registration
routes.post('/motion_dispatch_product_routes', userController.motion_dispatch_product_routes); // Dispatch Product
routes.post('/motion_product_category_routes', userController.motion_product_category_routes); // Product Category
routes.post('/motion_product_subcategories_routes', userController.motion_product_subcategories_routes); // Product Subcategories
routes.post('/motion_product_sub_subcategories_routes', userController.motion_product_sub_subcategories_routes); // Product Sub Subcategories
routes.post('/motion_products_routes', userController.motion_products_routes); // Products optionsl

// Your api's for get data.
routes.get('/motion_add_dealer_registration_get_routes', getController.motion_add_dealer_registration_get_routes); // Get Dealer Registration
routes.get('/motion_purchase_row_material_get_routes', getController.motion_purchase_row_material_get_routes); // Get Purchase Row Material
routes.get('/motion_employee_registration_get_routes', getController.motion_employee_registration_get_routes); // Get Employee Registration

module.exports = routes;




