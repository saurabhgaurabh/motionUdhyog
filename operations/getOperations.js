const connection = require("../config/database");


module.exports = {
    motion_add_dealer_registration_get_routes: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM motion_add_dealer_registration`;
            connection.execute(query, [], (error, result) => {
                if (error) {
                    return reject('Something went wrong while fetching data.');
                }
                resolve(result);
            });
        });
    },
    motion_purchase_row_material_get_routes: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM motion_purchase_row_material`;
            connection.execute(query, [], (getError, getResult) => {
                if (getError) {
                    return reject(`Something went wrong while fetching purchase row material data. ${getError})`);
                }
                resolve(getResult);
            })
        })
    }
}