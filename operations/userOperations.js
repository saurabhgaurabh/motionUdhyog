const connection = require('../config/database');
const { motion_user_registration_routes } = require('../controller/userController');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
                // Duplicate check
                const checkQuery = `SELECT * FROM motion_add_dealer_registration WHERE dealer_Code = ? OR dealer_GST = ?`;
        
                connection.execute(checkQuery, [dealer_Code, dealer_GST], (checkErr, checkResult) => {
                    if (checkErr) {
                        return reject('Error checking existing records.');
                    }
        
                    if (checkResult.length > 0) {
                        return reject('Dealer with same Code or GST already exists. Duplicate entry not allowed.');
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
        
                    connection.execute(insertQuery, values, (insertErr, result) => {
                        if (insertErr) {
                            console.error(insertErr);
                            return reject('Something went wrong while inserting data.');
                        }
                        resolve(result);
            })
        })
         }) }
}
