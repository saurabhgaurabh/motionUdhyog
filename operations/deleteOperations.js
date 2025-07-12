const connection = require("../config/database");

module.exports = {
    motion_add_dealer_registration_delete: (dealer_id) => {
        return new Promise((resolve, reject) => {
            const checkQuery = "SELECT dealer_id FROM motion_add_dealer_registration WHERE dealer_id = ?";
            connection.execute(checkQuery, [dealer_id], (checkError, checkResult) => {
                if (checkError) {
                    console.error("Error executing check query:", checkError);
                    return reject({ message: "Internal Server Error", status: false });
                }
                const deleteQuery = 'UPDATE motion_add_dealer_registration SET status = ? WHERE dealer_id = ?';
                connection.execute(deleteQuery, ['deleted', dealer_id], (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        console.error('Error deleting dealer:', deleteErr);
                        return reject({ message: 'Error deleting dealer.', status: false });
                    }
                    resolve({ status: true, message: 'Dealer deleted successfully.', result: deleteResult });
                });
            });
        });
    },
}