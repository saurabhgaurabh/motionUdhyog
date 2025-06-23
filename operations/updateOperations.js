const connection = require("../config/database");
const saltRounds = 10;
const bcrypt = require("bcrypt");


module.exports = {
    update_dealer_registration: (
        dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country, state,
        city, address, postal_code) => {
        return new Promise((resolve, reject) => {
            const updateQuery = ` UPDATE motion_add_dealer_registration SET
                dealer_name = ?, dealer_GST = ?, mobile_number = ?, 
                adhar_number = ?, pan = ?, password = ?, country = ?, 
                state = ?, city = ?, address = ?, postal_code = ?  WHERE dealer_Code = ?
        `;

            const values = [
                dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country,
                state, city, address, postal_code, dealer_Code // WHERE condition
            ];

            connection.execute(updateQuery, values, (err, result) => {
                if (err) {
                    return reject(`Error updating dealer data. ${err}`);
                }
                resolve({ message: "Dealer updated successfully", result });
            });
        });
    },

    motion_purchase_row_material_update: (
        order_id, dealer_name, material_type, postal_code, password, country,
        state, city, address, freight, material_amount, material_amount_remaining) => {
        return new Promise((resolve, reject) => {
            const updateQuery = `update motion_purchase_row_material set
                        dealer_name = ?, material_type = ?, postal_code = ?, password = ?, country = ?,
                        state = ?, city = ?, address = ?, freight = ?, material_amount = ?,
                        material_amount_remaining = ? where order_id = ?`;

            // Hash the password before storing it
            bcrypt.hash(password, saltRounds, (saltErr, hashPassword) => {
                if (saltErr) {
                    return reject(`Error hashing password. ${saltErr}`);
                }

                const updateValues = [
                    dealer_name, material_type, postal_code, hashPassword, country,
                    state, city, address, freight, material_amount,
                    material_amount_remaining, order_id // WHERE condition
                ];

                connection.execute(updateQuery, updateValues, (updateErr, updateResult) => {
                    if (updateErr) {
                        return resolve.status(500).json({ status: false, message: `Internal Server Error While Update. ${updateErr}` });
                    }
                    resolve({ message: "Row Material Updated Successfully", result: updateResult });
                })
            })
        });
    },

}