const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const getController = require('../controller/getController');
const updateController = require('../controller/updateController');
const deleteController = require('../controller/deleteController');



// Your api's for post data.
routes.post('/v1/motion-add-dealer-registration-post', userController.motion_add_dealer_registration_routes);      // home  
routes.post('/v1/motion-purchase-row-material-post', userController.motion_purchase_row_material_routes);  // purchase_Tab         
routes.post('/v1/motion-employee-registration', userController.motion_employee_registration_routes); // Home emp reg
routes.post('/v1/motion-product-manufacturing', userController.motion_product_manufacturing_routes); // Home product
routes.post('/v1/motion-parties-registration', userController.motion_parties_registration_routes); // Home clients
routes.post('/motion_dispatch_product_routes', userController.motion_dispatch_product_routes); //Home
routes.post('/v1/motion-product-category-post', userController.motion_product_category_routes); //Products
routes.post('/v1/motion-product-subcategories-post', userController.motion_product_subcategories_routes); //Products 
routes.post('/motion_product_sub_subcategories_routes', userController.motion_product_sub_subcategories_routes); //Products 
routes.post('/motion_products_routes', userController.motion_products_routes); // Products optionals
routes.post('/v1/motion-daily-tasks', userController.motion_daily_tasks); // Home
routes.post('/v1/motion-sales', userController.motion_sales_routes);
// today orders
  //monthly report 
     
// authentication 
routes.post('/v1/motion-user-registration', userController.motion_user_registration_routes); 
routes.post('/v1/verify-user-otp', userController.verify_user_otp);
routes.post('/v1/user-login', userController.user_login);

routes.post('/v1/user-otp-verification', userController.user_otp_verification);
 

 

// Your api's for get data.
routes.get('/v1/motion-add-dealer-registration-get', getController.motion_add_dealer_registration_get_routes);
routes.get('/v1/motion-purchase-row-material-get', getController.motion_purchase_row_material_get_routes);
routes.get('/v1/motion-employee-registration-get', getController.motion_employee_registration_get_routes);
routes.get('/v1/product-manufacturing-get', getController.motion_product_manufacturing_get_routes);
routes.get('/v1/motion-parties-registration-get', getController.motion_parties_registration_get_routes);
routes.get('/motion_dispatch_product_get_routes', getController.motion_dispatch_product_get_routes);
routes.get('/v1/motion-product-category-get', getController.motion_product_category_get_routes);
routes.get('/v1/motion-product-subcategories-get', getController.motion_product_subcategories_get_routes);
routes.get('/motion_product_sub_subcategories_get_routes', getController.motion_product_sub_subcategories_get_routes);
routes.get('/motion_products_get_routes', getController.motion_products_get_routes);
routes.get('/v1/motion-daily-tasks-get', getController.motion_daily_tasks_get_routes);
routes.get('/v1/motion-sales-get', getController.motion_sales_get_routes);
routes.get('/v1/motion-product-category-with-subcategories-get',
   getController.motion_product_category_with_subcategories_get_routes);




// Your api's for Update data.
routes.patch('/v1/dealer-registration', updateController.update_dealer_registration);
routes.post('/v1/motion/purchase_row_material_update', updateController.motion_purchase_row_material_update);
routes.patch('/v1/employee-registration-update', updateController.motion_employee_registration_update);
routes.patch('/v1/motion/product-manufacturing-update', updateController.motion_product_manufacturing_update);
routes.patch('/v1/motion-parties-registration-update', updateController.motion_parties_registration_update);

// delete api's
routes.delete('/V1/motion-dealer-delete', deleteController.motion_add_dealer_registration_delete);
// routes.delete('/v1-motion-sales-delete', deleteController.motion_sales_delete);


module.exports = routes;