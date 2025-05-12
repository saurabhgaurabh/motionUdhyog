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
            console.log(result, 'my new result')
            return res.status(200).json({ status: true, message: `Registration Completed Successfully.`, result: result });
        } catch (error) {
            return res.status(500).json({ result: [], status: false, message: `Internal Server Error. ${error}` })
        }
    }
}
