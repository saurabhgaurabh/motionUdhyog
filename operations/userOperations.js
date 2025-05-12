const connection = require('../config/database');
const { motion_user_registration_routes } = require('../controller/userController');

module.exports = {
    udhyog_registration: (name, city, postal_code) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO udhyog_registration (name, city, postal_code) VALUES (?, ?, ?)`;
            connection.execute(query, [name, city, postal_code], (error, result) => {
                if (error) {
                    // console.log(error);
                    return reject('Something went wrong.');
                }
                resolve(result);
            });
        });
    },
    // motion_user_registration_routes: (userCode, company_name, owner_name, industry_type, GST_number, registration_email,
    //     mobile_number, password, confirm_password, country, state, city, address, postal_code, website) => {
    //     return new Promise((resolve, reject) => {
    //         const query = `INSERT INTO motion_user_registration (userCode,company_name,owner_name, industry_type, GST_number, registration_email,
    //     mobile_number,password,confirm_password,country,state,city,address,postal_code,website) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    //         const values = [
    //             userCode, company_name, owner_name, industry_type, GST_number, registration_email,
    //             mobile_number, password, confirm_password, country, state, city, address, postal_code, website
    //         ];

    //         connection.execute(query, values, (error, result) => {
    //             if (error) {
    //                 console.log(error);
    //                 return reject('Something went wrong while inserting data.');
    //             }
    //             resolve(result);
    //         });
    //     });
    // }
    motion_user_registration_routes: (
        userCode, company_name, owner_name, industry_type, GST_number,
        registration_email, mobile_number, password, confirm_password,
        country, state, city, address, postal_code, website
    ) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `SELECT * FROM motion_user_registration WHERE userCode = ? OR registration_email = ?`;
            connection.execute(checkQuery, [userCode, registration_email], (checkErr, checkResult) => {
                if (checkErr) {
                    console.log(checkErr, "check error")
                    return reject(`Error checking existing records.`);
                }
                if (checkResult.length > 0) {
                    return reject('User with same userCode or email already exists. Duplicate Entry Not Allow');
                }

                // Proceed to insert only if no duplicates
                const insertQuery = `INSERT INTO motion_user_registration 
                ( userCode, company_name, owner_name, industry_type, GST_number, registration_email, mobile_number,
                password, confirm_password, country, state, city, address, postal_code, website )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const values = [userCode, company_name, owner_name, industry_type, GST_number,
                    registration_email, mobile_number, password, confirm_password,
                    country, state, city, address, postal_code, website];

                connection.execute(insertQuery, values, (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error(insertErr);
                        return reject('Something went wrong while inserting data.');
                    }
                    resolve(insertResult);
                })
            })
        })
    }
}
