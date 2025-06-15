const updateOperations = require('../operations/updateOperations');

module.exports = {
    update_dealer_registration: async (req, res) => {
        try {
            const requiredFields = [
                'dealer_Code', 'dealer_name', 'dealer_GST', 'mobile_number', 'adhar_number', 'pan', 'password',
                'country', 'state', 'city', 'address', 'postal_code'
            ];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ status: false, message: `${field.replace(/_/g, ' ')} is required.` });
                }
            }
            const {
                dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country,
                state, city, address, postal_code
            } = req.body;

            const result = await updateOperations.update_dealer_registration(
                dealer_Code, dealer_name, dealer_GST, mobile_number,
                adhar_number, pan, password, country,
                state, city, address, postal_code
            );
            return res.status(200).json({ status: true, message: result.message, result: result.result });
        }
        catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error While Update. ${error}` });
        }
    },
    // motion_purchase_row_material_update: async (req, res) => {
    //     try {

    //     } catch (error) {
    //         return res.status(500).json({ status: false, message: `Internal Server Error While Update. ${error}` });
    //     }
    // }

}