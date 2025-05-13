const connection = require('../config/database');
// const { motion_user_registration_routes } = require('../controller/userController');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const { generateRandomId, generateRandomCode, generatePurchaseId } = require('../utils/helper');


// modules for Operations
module.exports = {
    udhyog_registration: (name, city, postal_code) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO udhyog_registration (name, city, postal_code) VALUES (?, ?, ?)`;
            connection.execute(query, [name, city, postal_code], (error, result) => {
                if (error) {
                    // console.log(error);
                    return reject('Something went wrong while inserting data.');
                }
                resolve(result);
            });
        });
    },

    // Api for motion user registration 
    motion_user_registration_routes: (
        userCode, company_name, owner_name, industry_type, GST_number,
        registration_email, mobile_number, password, confirm_password,
        country, state, city, address, postal_code, website
    ) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `SELECT * FROM motion_user_registration WHERE userCode = ? OR registration_email = ?`;

            connection.execute(checkQuery, [userCode, registration_email], (checkErr, checkResult) => {
                if (checkErr) {
                    // console.log(checkErr, "check error");
                    return reject(`Error checking existing records.`);
                }

                if (checkResult.length > 0) {
                    return reject('User with same userCode or email already exists. Duplicate Entry Not Allowed');
                }

                // ✅ Hash password and confirm_password AFTER checking for duplicates
                bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                    if (err) {
                        return reject('Error hashing the password.');
                    }

                    bcrypt.hash(confirm_password, saltRounds, (err2, hashedConfirmPassword) => {
                        if (err2) {
                            return reject('Error hashing the confirm password.');
                        }

                        const insertQuery = `INSERT INTO motion_user_registration 
                        (userCode, company_name, owner_name, industry_type, GST_number, registration_email, mobile_number,
                        password, confirm_password, country, state, city, address, postal_code, website)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                        const values = [
                            userCode, company_name, owner_name, industry_type, GST_number,
                            registration_email, mobile_number, hashedPassword, hashedConfirmPassword,
                            country, state, city, address, postal_code, website
                        ];

                        connection.execute(insertQuery, values, (insertErr, insertResult) => {
                            if (insertErr) {
                                console.error(insertErr);
                                return reject('Something went wrong while inserting data.');
                            }
                            resolve(insertResult);
                        });
                    });
                });
            });
        });
    },
    motion_add_dealer_registration_routes: (dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country, state,
        city, address, postal_code) => {
        return new Promise((resolve, reject) => {
            dealer_Code = generateRandomCode();
            // Duplicate check
            const checkQuery = `SELECT * FROM motion_add_dealer_registration WHERE dealer_Code = ? OR dealer_GST = ?`;

            connection.execute(checkQuery, [dealer_Code, dealer_GST], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Error checking existing records.');
                }

                if (checkResult.length > 0) {
                    return reject('Dealer with same Code or GST already exists. Duplicate entry not allowed. error 1062');
                }

                // Insert query
                const insertQuery = `INSERT INTO motion_add_dealer_registration (
                        dealer_Code, dealer_name, dealer_GST, mobile_number,
                        adhar_number, pan, password, country, state,
                        city, address, postal_code
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const values = [
                    dealer_Code, dealer_name, dealer_GST, mobile_number,
                    adhar_number, pan, password, country, state,
                    city, address, postal_code
                ];

                connection.execute(insertQuery, values, (insertErr, insertresult) => {
                    if (insertErr) {
                        console.error(insertErr);
                        return reject(`Something went wrong while inserting data.${insertErr}`);
                    }
                    resolve(insertresult);
                })
            })
        })
    },
    motion_purchase_row_material_routes: (purchase_id, order_id, dealer_name, material_type, postal_code,
        password, country, state, city, address, freight, material_amount, material_amount_remaining) => {
        return new Promise((resolve, reject) => {
            purchase_id = generatePurchaseId();
            order_id = generateRandomId();

            const checkQuery = `select * from motion_purchase_row_material where order_id = ? OR dealer_name = ? OR purchase_id = ?`;
            connection.execute(checkQuery, [purchase_id, order_id, dealer_name], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Getting existing Records.');
                }
                if (checkResult.length > 0) {
                    return reject(`Dealer id or name exists. Duplicate entry not allow. 1062`)
                }
            })

            bcrypt.hash(password, saltRounds, (Error, hashedPassword) => {
                if (Error) {
                    reject(`Error Hashing the Password. ${Error}`)
                }
                const insertquery = `insert into motion_purchase_row_material
                 (purchase_id, order_id, dealer_name, material_type, postal_code, password, country, state, 
                city, address, freight, material_amount, material_amount_remaining) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                const values = [
                    purchase_id, order_id, dealer_name, material_type, postal_code,
                    hashedPassword, country, state, city, address, freight, material_amount, material_amount_remaining
                ];
                connection.execute(insertquery, values, (insertErr, insertResult) => {
                    if (insertErr) {
                        return reject(`Something went wrong while inserting data.${insertErr}`);
                    }
                    resolve(insertResult);
                })
            })
        })
    },
    motion_employee_registration_routes: (emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email) => {
        return new Promise((resolve, reject) => {
            emp_id = generateRandomId();
            emp_code = generateRandomCode();
            const checkQuery = `select * from motion_employee_registration where emp_id = ? or emp_code = ?`;
            connection.execute(checkQuery,[emp_id, emp_code], (checkErr, checkResult)=>{
                if(checkErr){
                    return reject('Getting Existing Records.')
                }
                if(checkResult.length > 0){
                    return reject(`Employee id or Employees Code exists. Duplicate entry not allow. 1062`)
                }
            })
            const insertQuery = `insert into motion_employee_registration 
            (emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email];
            console.log(values,"insertQuery")
            connection.execute(insertQuery, values, (insertErr, insertResult) => {
                if (insertErr) {
                    console.log(insertErr, "inserterror")
                     return reject(`Data, Inserting error ${insertErr}`);
                }
                resolve(insertResult);
            })
        })
    }
}
