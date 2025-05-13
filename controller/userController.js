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
    },
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
    },
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

    },
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
    },
    motion_employee_registration_routes: async (req, res) => {
        try {
            const requiredFields = ['name', 'state', 'city', 'address', 'postal_code', 'qualification', 'adhar', 'pan', 'mobile', 'email'];
            for (fields of requiredFields) {
                if (!req.body[fields]) { return res.status(500).json({ status: false, message: `${fields.replace('_', ' ')} 'is required'` }) };
            }
            const { name, state, city, address, postal_code, qualification, adhar, pan, mobile, emial } = req.body;
            const resValue = [name, state, city, address, postal_code, qualification, adhar, pan, mobile, emial];
            const result = await userOperations.motion_employee_registration_routes(resValue);
            return res.status(200).json({ stats: true, message: 'Employee Registered Successfully.' });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server Error. ${error}`, result: result });
        }
    }
}
