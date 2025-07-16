const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const getController = require('../controller/getController');
const updateController = require('../controller/updateController');
const deleteController = require('../controller/deleteController');



// Your api's for post data.
 /* NOT GET*/ routes.post('/v1/motion-user-registration', userController.motion_user_registration_routes); 
routes.post('/v1/motion-add-dealer-registration-post', userController.motion_add_dealer_registration_routes);        
routes.post('/v1/motion-purchase-row-material-post', userController.motion_purchase_row_material_routes);            
routes.post('/v1/motion-employee-registration', userController.motion_employee_registration_routes); 
routes.post('/v1/motion-product-manufacturing', userController.motion_product_manufacturing_routes); 
routes.post('/motion_parties_registration_routes', userController.motion_parties_registration_routes); 
routes.post('/motion_dispatch_product_routes', userController.motion_dispatch_product_routes); 
routes.post('/motion_product_category_routes', userController.motion_product_category_routes); 
routes.post('/motion_product_subcategories_routes', userController.motion_product_subcategories_routes); 
routes.post('/motion_product_sub_subcategories_routes', userController.motion_product_sub_subcategories_routes); 
routes.post('/motion_products_routes', userController.motion_products_routes); // Products optionals

// authentication 
routes.post('/v1/verify-user-otp', userController.verify_user_otp);



// Your api's for get data.
routes.get('/v1/motion-add-dealer-registration-get', getController.motion_add_dealer_registration_get_routes);
routes.get('/v1/motion-purchase-row-material-get', getController.motion_purchase_row_material_get_routes);
routes.get('/v1/motion-employee-registration-get', getController.motion_employee_registration_get_routes);
routes.get('/v1/product-manufacturing-get', getController.motion_product_manufacturing_get_routes);
routes.get('/motion_parties_registration_get_routes', getController.motion_parties_registration_get_routes);
routes.get('/motion_dispatch_product_get_routes', getController.motion_dispatch_product_get_routes);
routes.get('/motion_product_category_get_routes', getController.motion_product_category_get_routes);
routes.get('/motion_product_subcategories_get_routes', getController.motion_product_subcategories_get_routes);
routes.get('/motion_product_sub_subcategories_get_routes', getController.motion_product_sub_subcategories_get_routes);
routes.get('/motion_products_get_routes', getController.motion_products_get_routes);




// Your api's for Update data.
routes.patch('/v1/dealer-registration', updateController.update_dealer_registration);
routes.post('/purchase_row_material_update', updateController.motion_purchase_row_material_update);
routes.patch('/v1/employee-registration-update', updateController.motion_employee_registration_update);
routes.patch('/v1/product-manufacturing-update', updateController.motion_product_manufacturing_update);
routes.post('/motion_parties_registration_update', updateController.motion_parties_registration_update);

// delete api's
routes.delete('/V1/motion-dealer-delete', deleteController.motion_add_dealer_registration_delete);


module.exports = routes;