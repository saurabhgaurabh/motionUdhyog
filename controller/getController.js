const getOperations = require("../operations/getOperations");

module.exports = {
    motion_add_dealer_registration_get_routes: async (req, res) => {
        try {
            const result = await getOperations.motion_add_dealer_registration_get_routes();
            return res.status(200).json({ status: true, message: 'Dealer Registration Data Fetched Successfully.', result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    }, // motion_add_dealer_registration_get_routes
    motion_purchase_row_material_get_routes: async (req, res) => {
        try {
            const materialResult = await getOperations.motion_purchase_row_material_get_routes();
            return res.status(200).json({ status: true, message: `Purchase Row Material Data Fetched Successfully.`, result: materialResult });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    },
}