const userOperations = require('../operations/userOperations');
const logger = require('../utils/logger');
const speakeasy = require('speakeasy');

module.exports = {
    motion_user_registration_routes: async (req, res) => {
        try {
            const requiredFields = ['userCode', 'company_name', 'owner_name', 'industry_type', 'GST_number',
                'registration_email', 'mobile_number', 'password', 'confirm_password',
                'country', 'state', 'city', 'address', 'postal_code', 'website'];
            for (const field of requiredFields) {
                if (!req.body[field]) { // checks if that field exists in the incoming request.
                    return res.status(404).json({ status: false, message: `${field.replace('_', ' ')} is required.` }); //If any field is missing or empty, it stops and returns a message like: //field.replace('_', ' ') just makes the message more readable (postal_code ➝ postal code)
                }
            }
            const { userCode, company_name, owner_name, industry_type, GST_number, registration_email, mobile_number, password, confirm_password, country,
                state, city, address, postal_code, website } = req.body;

            const result = await userOperations.motion_user_registration_routes(userCode, company_name, owner_name, industry_type, GST_number, registration_email,
                mobile_number, password, confirm_password, country, state, city, address, postal_code, website);
            return res.status(200).json({ status: true, message: `Registration Completed Successfully.`, result: result });
        } catch (error) {
            return res.status(500).json({ result: [], status: false, message: `Internal Server Errors. ${error}` })
        }
    },// motion_user_registration_routes


    verify_user_otp: async (req, res) => {
        try {
            const { userCode, userOTP } = req.body;
            if (!userCode || !userOTP) {
                return res.status(400).json({ status: false, message: 'User code and OTP are required.' });
            }
            const user = await userOperations.verify_user_otp(userCode, userOTP);
            return res.status(200).json({ status: true, message: 'OTP verified successfully.', user: user });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return res.status(500).json({ status: false, message: `Internal server error. ${error.message}` });
        }
    }, // verify_user_otp

    user_login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ status: false, message: 'Email and password are required.' });
            }
            const user = await userOperations.user_login(email, password);
            return res.status(200).json({ status: true, message: 'Login successful.', user: user });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server error. ${error.message}` });
        }
    },


    motion_add_dealer_registration_routes: async (req, res) => {
        try {
            // logger.info('Dealer registration initiated');
            const requiredFields = ['dealer_Code', 'dealer_name', 'dealer_GST', 'mobile_number', 'adhar_number',
                'pan', 'password', 'email', 'alt_mobile_number', 'country',
                'state', 'city', 'address', 'postal_code'];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(500).json({ status: false, message: `${field.replace('_', ' ')} is required.` });
                }
            }
            const { dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, email, alt_mobile_number, country, state, city, address, postal_code } = req.body;
            const result = await userOperations.motion_add_dealer_registration_routes(
                dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, email,
                alt_mobile_number, country, state, city, address, postal_code
            );

            return res.status(200).json({ status: true, message: 'Dealer Added Successfully.' });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server error. ${error}` });
        }

    },// motion_add_dealer_registration_routes                -----  FETCHING DATA  -------------
    motion_purchase_row_material_routes: async (req, res) => {
        try {
            const requiredFields = ['order_id', 'dealer_name', 'material_type', 'postal_code', 'password', 'country',
                'state', 'city', 'address', 'freight', 'material_amount', 'material_amount_remaining'
            ];

            for (field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(500).json({ status: false, message: `${field.replace('_', ' ')} is required.` });
                }
            }

            const { order_id, dealer_name, material_type, postal_code, password, country, state, city, address, freight, material_amount,
                material_amount_remaining } = req.body;

            const result = await userOperations.motion_purchase_row_material_routes(order_id, dealer_name, material_type, postal_code,
                password, country, state, city, address, freight, material_amount, material_amount_remaining);
            return res.status(200).json({ status: true, message: 'Purchase Added Successfully.' });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server error: ${error.message || error}` })
        }
    },//  motion_purchase_row_material_routes                 -----  FETCHING DATA  -------------
    motion_employee_registration_routes: async (req, res) => {
        try {
            const requiredFields = [
                'name', 'dob', 'state', 'city', 'address', 'postal_code', 'qualification', 'adhar',
                'pan', 'mobile', 'email', 'department', 'designation', 'salary'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(500).json({ status: false, message: `${fields.replace('_', ' ')} 'is required'` })
                };
            }
            const { name, dob, state, city, address, postal_code, qualification, adhar, pan, mobile, email,
                department, designation, salary } = req.body;
            const result = await userOperations.motion_employee_registration_routes(
                name, dob, state, city, address, postal_code, qualification, adhar, pan, mobile, email,
                department, designation, salary
            );
            return res.status(200).json({ stats: true, message: 'Employee Registered Successfully.', result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server Error. ${error}` });
        }
    },// motion_employee_registration_routes                      -----  FETCHING DATA  -------------
    motion_product_manufacturing_routes: async (req, res) => {
        try {
            const { product_name, material_type_one, material_quantity, material_quality, unit, batch_number, supervisor_name, total_cost, remarks,
                created_by, last_modified_by } = req.body;
            const requiredFields = [
                'product_name', 'material_type_one', 'material_quantity', 'material_quality', 'unit', 'batch_number',
                'supervisor_name', 'total_cost', 'remarks', 'created_by', 'last_modified_by'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} 'is required.'` })
                }
            }
            const result = await userOperations.motion_product_manufacturing_routes(product_name, material_type_one, material_quantity,
                material_quality, unit, batch_number, supervisor_name, total_cost, remarks, created_by, last_modified_by);
            return res.status(200).json({ status: true, message: `Product Manufactured Completed.`, result: result });

        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error.${error}` });
        }
    },// motion_product_manufacturing_routes                          -----  FETCHING DATA  -------------
    motion_parties_registration_routes: async (req, res) => {
        try {
            const { organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan } = req.body;
            const requiredFields = [
                'organization_name', 'owner_name', 'mobile', 'email', 'gst', 'country', 'state', 'city', 'address', 'adhar', 'pan'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} 'is required.'` })
                }
            }
            const result = await userOperations.motion_parties_registration_routes(
                organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan);
            return res.status(200).json({ status: true, message: `Parties Added Successfully.`, result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `internal server error.${error}` });
        }
    }, // motion_parties_registration_routes          -----  FETCHING DATA  -------------
    motion_dispatch_product_routes: async (req, res) => {
        try {
            const { dispatch_id, dispatch_code, organization_name, owner_name, mobile, email, product_name, product_type,
                quantity, height, width, color, packing_type, dispatch_mode, address, city, state, country, postal_code, gst, freight,
            } = req.body;
            const requiredFields = [
                'dispatch_id', 'dispatch_code', 'organization_name', 'owner_name', 'mobile', 'email', 'product_name', 'product_type', 'quantity',
                'height', 'width', 'color', 'packing_type', 'dispatch_mode', 'address', 'city', 'state', 'country', 'postal_code', 'gst', 'freight',
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` })
                }
            }
            const result = await userOperations.motion_dispatch_product_routes(
                dispatch_id, dispatch_code, organization_name, owner_name, mobile, email, product_name, product_type,
                quantity, height, width, color, packing_type, dispatch_mode, address, city, state, country, postal_code, gst, freight,
            );
            // console.log(result,"result")
            return res.status(200).json({ status: true, message: 'Product Dispatch Successfully.', result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `internal server Error. ${error}` });
        }
    }, // motion_dispatch_product_routes
    motion_product_category_routes: async (req, res) => {
        try {
            const { category_name, description } = req.body;
            const requiredFields = [
                'category_name', 'description'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
            }
            const result = await userOperations.motion_product_category_routes(category_name, description);
            console.log(result, "result.")
            return res.status(201).json({ status: true, message: `Registered Successfully.` })
        } catch (error) {
            console.log(error, "error in motion_product_category_routes")
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    }, // motion_product_category_routes
    motion_product_subcategories_routes: async (req, res) => {
        try {
            const { sub_category_name, description, category_id } = req.body;
            const requiredFields = [
                'sub_category_name', 'description', 'category_id'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
            }
            const result = await userOperations.motion_product_subcategories_routes(sub_category_name, description, category_id);
            // console.log(result, "result in motion_product_subcategories_routes");
            return res.status(201).json({ status: true, message: `Subcategory Registered Successfully.` });
        } catch (error) {
            console.log(error, "error in motion_product_subcategories_routes");
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    }, // motion_product_subcategories_routes
    motion_product_sub_subcategories_routes: async (req, res) => {
        try {
            const { sub_sub_category_name, description, sub_category_id } = req.body;
            const requiredFields = ['sub_sub_category_name', 'description', 'sub_category_id'];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
                const result = await userOperations.motion_product_sub_subcategories_routes(sub_sub_category_name, description, sub_category_id);
                console.log(result, "result in motion_product_sub_subcategories_routes");
                return res.status(201).json({ status: true, message: `Sub Subcategory Registered Successfully.` });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` })
        }
    },// motion_product_sub_subcategories_routes
    motion_products_routes: async (req, res) => {
        try {
            const { product_name, category_id, sub_category_id, sub_sub_category_id, price } = req.body;
            const requiredFields = ['product_name', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'price'];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
            }
            const result = await userOperations.motion_products_routes(
                product_name, category_id, sub_category_id, sub_sub_category_id, price);
            // console.log(result, "result in motion_products_routes");
            return res.status(201).json({ status: true, message: `Product Registered Successfully.` });
        } catch (error) {
            console.log(error, "error in motion_products_routes");
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    }, // motion_products_routes





}
