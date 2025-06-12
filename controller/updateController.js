const updateOperations = require('../operations/updateOperations');

module.exports = {
    motion_add_dealer_registration_routes_update: async (req, res) => {
        try {
            const requiredFields = [
                'dealer_Code', 'dealer_name', 'dealer_GST', 'mobile_number',
                'adhar_number', 'pan', 'password', 'country',
                'state', 'city', 'address', 'postal_code'
            ];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ status: false, message: `${field.replace(/_/g, ' ')} is required.` });
                    // /g: The global flag, which means replace all underscores, not just the first one.
                }
            }

            const {
                dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country,
                state, city, address, postal_code } = req.body;

            const result = await updateOperations.motion_add_dealer_registration_routes_update(
                dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country,
                state, city, address, postal_code
            );

            return res.status(200).json({ status: true, message: result.message, result: result.result });

        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    }

}