const deleteOperations = require('../operations/deleteOperations');

module.exports = {
    motion_add_dealer_registration_delete: async (req, res) => {
        try {
            const { dealer_id } = req.body;
            if (!dealer_id) {
                return res.status(400).json({ status: false, message: 'Dealer Id is required.' });
            }
            const result = await deleteOperations.motion_add_dealer_registration_delete(dealer_id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ status: false, message: 'Dealer not found or already deleted.' });
            }
            return res.status(200).json({ status: true, message: 'Dealer deleted successfully.' });
        } catch (error) {
            console.error('Delete error:', error);
            return res.status(500).json({ status: false, message: `Internal Server Error: ${error}` });
        }
    },
    // motion_sales_delete

}

