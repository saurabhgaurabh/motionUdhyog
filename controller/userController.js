const userOperations = require('../operations/userOperations');



module.exports = {
    udhyog_registration: async (req, res) => {
        try {
            const { name, city, postal_code } = req.body;
            if (!name) return res.status(200).json({ status: false, message: 'Name is require.' });
            if (!city) return res.status(200).json({ status: false, message: 'City is required.' });
            if (!postal_code) return res.status(200).json({ status: false, message: 'Postal code is required.' });

            const result = await userOperations.udhyog_registration(name, city, postal_code);
            return res.status(201).json({ status: true, message: "Registration successful!", result: result });

        } catch (error) {
            return res.status(509).json({ result: [], status: false, message: `Internasl Server Error ${error}` })
        }
    },// udhyog_registration
    motion_user_registration_routes: async (req, res) => {
        try {
            const requiredFields = ['userCode', 'company_name', 'owner_name', 'industry_type', 'GST_number',
                'registration_email', 'mobile_number', 'password', 'confirm_password',
                'country', 'state', 'city', 'address', 'postal_code', 'website'];
            // validate required fields
            for (const field of requiredFields) {
                if (!req.body[field]) { // checks if that field exists in the incoming request.
                    return res.status(200).json({ status: false, message: `${field.replace('_', ' ')} is required.` });
                    //If any field is missing or empty, it stops and returns a message like:
                    //field.replace('_', ' ') just makes the message more readable (postal_code ➝ postal code)
                }
            }
            const { userCode, company_name, owner_name, industry_type, GST_number, registration_email, mobile_number, password, confirm_password, country,
                state, city, address, postal_code, website } = req.body;

            const result = await userOperations.motion_user_registration_routes(userCode, company_name, owner_name, industry_type, GST_number, registration_email,
                mobile_number, password, confirm_password, country, state, city, address, postal_code, website);
            // console.log(result, 'my new result')
            return res.status(200).json({ status: true, message: `Registration Completed Successfully.`, result: result });
        } catch (error) {
            return res.status(500).json({ result: [], status: false, message: `Internal Server Error. ${error}` })
        }
    },// motion_user_registration_routes
    motion_add_dealer_registration_routes: async (req, res) => {
        try {
            const requiredFields = ['dealer_Code', 'dealer_name', 'dealer_GST', 'mobile_number', 'adhar_number', 'pan', 'password', 'country',
                'state', 'city', 'address', 'postal_code'];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(500).json({ status: false, message: `${field.replace('_', ' ')} is required.` });
                }
            }
            const { dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country, state, city, address, postal_code } = req.body;

            const result = await userOperations.motion_add_dealer_registration_routes(dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country, state, city, address, postal_code);
            // console.log(result, 'result dealer');
            return res.status(200).json({ status: true, message: 'Dealer Added Successfully.' });


        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server error. ${error}` });
        }

    },// motion_add_dealer_registration_routes
    motion_purchase_row_material_routes: async (req, res) => {
        try {
            const requiredFields = ['order_id', 'dealer_name', 'material_type', 'postal_code', 'password', 'country', 'state',
                'city', 'address', 'freight', 'material_amount', 'material_amount_remaining'
            ];

            for (field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(500).json({ status: false, message: `${field.replace('_', ' ')} is required.` });
                }
            }

            const { purchase_id, order_id, dealer_name, material_type, postal_code, password, country, state, city, address, freight, material_amount,
                material_amount_remaining } = req.body;

            const result = await userOperations.motion_purchase_row_material_routes(purchase_id, order_id, dealer_name, material_type, postal_code,
                password, country, state, city, address, freight, material_amount, material_amount_remaining);
            return res.status(200).json({ status: true, message: 'Purchase Added Successfully.' });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server error: ${error.message || error}` })
        }
    },//  motion_purchase_row_material_routes
    motion_employee_registration_routes: async (req, res) => {
        try {
            const requiredFields = ['emp_id', 'emp_code', 'name', 'state', 'city', 'address', 'postal_code', 'qualification', 'adhar', 'pan', 'mobile', 'email'];
            for (fields of requiredFields) {
                if (!req.body[fields]) { return res.status(500).json({ status: false, message: `${fields.replace('_', ' ')} 'is required'` }) };
            }
            const { emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email } = req.body;
            const result = await userOperations.motion_employee_registration_routes(emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email);
            return res.status(200).json({ stats: true, message: 'Employee Registered Successfully.' });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server Error. ${error}` });
        }
    },// motion_employee_registration_routes
    motion_product_manufacturing_routes: async (req, res) => {
        try {
            const { mfr_id, product_name, material_type_one, material_quantity, material_quality, unit, batch_number, supervisor_name, total_cost, remarks,
                created_by, last_modified_by } = req.body;

            const requiredFields = [
                'mfr_id', 'product_name', 'material_type_one', 'material_quantity', 'material_quality', 'unit', 'batch_number',
                'supervisor_name', 'total_cost', 'remarks', 'created_by', 'last_modified_by'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} 'is required.'` })
                }
            }

            const result = await userOperations.motion_product_manufacturing_routes(mfr_id, product_name, material_type_one, material_quantity,
                material_quality, unit, batch_number, supervisor_name, total_cost, remarks, created_by, last_modified_by);
            return res.status(200).json({ status: true, message: `Product Manufactured Completed.`, result: result });

        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error.${error}` });
        }
    },// motion_product_manufacturing_routes
    motion_parties_registration_routes: async (req, res) => {
        try {
            const { party_id, organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan } = req.body;
            const requiredFields = [
                'party_id', 'organization_name', 'owner_name', 'mobile', 'email', 'gst', 'country', 'state', 'city', 'address', 'adhar', 'pan'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} 'is required.'` })
                }
            }
            const result = await userOperations.motion_parties_registration_routes(
                party_id, organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan);
            console.log(result, "result")
            return res.status(200).json({ status: true, message: `Parties Added Successfully.`, result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `internal server error.${error}` });
        }
    }, // motion_parties_registration_routes
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
                    return res.status(404).json({ status: false, message: `${field.replace('_', ' ')} is required.` })
                }
            }
            const result = await userOperations.motion_dispatch_product_routes(
                dispatch_id, dispatch_code, organization_name, owner_name, mobile, email, product_name, product_type,
                quantity, height, width, color, packing_type, dispatch_mode, address, city, state, country, postal_code, gst, freight,
            );
            return res.status(200).json({ status: true, message: 'Product Dispatch Successfully.', result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `insernal server error. ${error}` });
        }
    }, // motion_dispatch_product_routes
    motion_product_category_routes: async (req, res) => {
        try {
            const { product_name, description } = req.body;
            const requiredFields = [
                'product_name', 'description'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
            }
            const result = await userOperations.motion_product_category_routes(product_name, description);
            console.log(result, "result.")
            return res.status(201).json({ status: true, message: `Registred Successfully.` })
        } catch (error) {
            console.log(error, "error in motion_product_category_routes")
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    }, // motion_product_category_routes
    motion_product_subcategories_routes: async (req, res) => {
        try {
            const { sub_Cat_name, description, category_id } = req.body;
            const requiredFields = [
                'sub_Cat_name', 'description', 'category_id'
            ];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
            }
            const result = await userOperations.motion_product_subcategories_routes(sub_Cat_name, description, category_id);
            console.log(result, "result in motion_product_subcategories_routes");
            return res.status(201).json({ status: true, message: `Subcategory Registered Successfully.` });
        } catch (error) {
            console.log(error, "error in motion_product_subcategories_routes");
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    },
    motion_product_sub_subcategories_routes: async (req, res) => {
        try {
            const { sub_sub_cat_name, description, subcategory_id } = req.body;
            const requiredFields = ['sub_sub_cat_name', 'description', 'subcategory_id'];
            for (fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(404).json({ status: false, message: `${fields.replace('_', ' ')} is required.` });
                }
                const result = await userOperations.motion_product_sub_subcategories_routes(sub_sub_cat_name, description, subcategory_id);
                console.log(result, "result in motion_product_sub_subcategories_routes");
                return res.status(201).json({ status: true, message: `Sub Subcategory Registered Successfully.` });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` })
        }
    }
}
