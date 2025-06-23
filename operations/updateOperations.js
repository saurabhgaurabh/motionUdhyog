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
    motion_employee_registration_update: (emp_code, name, state, city, address, postal_code,
        qualification, adhar, pan, mobile, email) => {
        return new Promise((resolve, reject) => {
            const updateQuery = `update motion_employee_registration set 
                name = ?, state = ?, city = ?, address = ?, postal_code = ?,
                qualification = ?, adhar = ?, pan = ?, mobile = ?, email = ? where emp_code = ?`;

            const updateValues = [
                name, state, city, address, postal_code, qualification, adhar, pan, mobile, email, emp_code
            ];

            connection.execute(updateQuery, updateValues, (updateErr, updateResult) => {
                if (updateErr) {
                    return reject(`Error updating employee data. ${updateErr}`);
                }
                resolve({ status: true, message: "Employee updated successfully", result: updateResult });
            })
        })
    },
    motion_product_manufacturing_update: (product_name, material_type_one, material_quantity, material_quality, unit,
        batch_number, supervisor_name, total_cost, remarks, mfr_id) => {
        return new Promise((resolve, reject) => {
            const updateQuery = `update motion_product_manufacturing set 
                product_name = ?, material_type_one = ?, material_quantity = ?,
                material_quality = ?, unit = ?, batch_number = ?, supervisor_name = ?,
                    total_cost = ?, remarks = ? where mfr_id = ?`;

            const updateValues = [
                product_name, material_type_one, material_quantity, material_quality, unit,
                batch_number, supervisor_name, total_cost, remarks, mfr_id
            ];
            connection.execute(updateQuery, updateValues, (updateErr, updateResult) => {
                if (updateErr) {
                    return reject(`Error updating manufacturing data. ${updateErr}`);
                }
                resolve({ status: true, message: "Manufacturing updated successfully", result: updateResult });
            })
        })
    },
}