const connection = require('../config/database');
const { generateRandomId, generateRandomCode, generatePurchaseId, fourDigitCode, generateManufacturingId, generate8DigitCode, generate6DigitCode } = require('../utils/helper');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const speakeasy = require('speakeasy');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'leadchainsaurabh7@gmail.com', pass: 'viqc qaim yhtg ngmj' }
});
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}


// modules for Operations
module.exports = {
    motion_user_registration_routes: (
        userCode, company_name, owner_name, industry_type, GST_number,
        registration_email, mobile_number, password, confirm_password,
        country, state, city, address, postal_code, website
    ) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `SELECT * FROM motion_user_registration WHERE userCode = ? OR registration_email = ?`;

            connection.execute(checkQuery, [userCode, registration_email], (checkErr, checkResult) => {
                if (checkErr) { return reject(`Error checking existing records.`); }
                if (checkResult.length > 0) {
                    const user = checkResult[0];
                    if (user.flag === 'verified') {
                        return reject('User already registered and verified.');
                    }
                }
                const baseSecret = speakeasy.generateSecret({ length: 20 });
                const otp_secret = baseSecret.base32;

                const userOTP = speakeasy.totp({
                    secret: otp_secret,
                    encoding: 'base32',
                    step: 300 //5 min
                });
                const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes later
                //  Send OTP Email
                const mailOptions = {
                    from: 'leadchainsaurabh7@gmail.com',
                    to: registration_email, //  Use the actual email variable
                    subject: 'ApkaUdhyog.com - OTP Verification',
                    text: `Hello user, your OTP is ${userOTP}`,
                    html: `hello otp is ${userOTP} `
                };

                transporter.sendMail(mailOptions, (mailErr, info) => {
                    if (mailErr) {
                        console.error('Mail sending error:', mailErr);
                        return reject('Failed to send OTP email.');
                    }
                    console.log('OTP email sent:', info.response);

                    // hash password
                    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                        if (err) {
                            return reject('Error hashing the password.');
                        }
                        bcrypt.hash(confirm_password, saltRounds, (err2, hashedConfirmPassword) => {
                            if (err2) {
                                return reject('Error hashing the confirm password.');
                            }
                            const insertQuery = `INSERT INTO motion_user_registration (
                            userCode, company_name, owner_name, industry_type, GST_number, registration_email,
                             mobile_number, password, confirm_password, country, state, city, address, postal_code,
                              website, flag, userOTP, otp_secret, otp_expiry
                              )   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                            const values = [
                                userCode, company_name, owner_name, industry_type, GST_number,
                                registration_email, mobile_number, hashedPassword, hashedConfirmPassword,
                                country, state, city, address, postal_code, website, 'unverified', userOTP
                                , otp_secret, otpExpiry
                            ];

                            connection.execute(insertQuery, values, (insertErr, insertResult) => {
                                if (insertErr) {
                                    console.error(insertErr);
                                    return reject('Something went wrong while inserting data.');
                                }
                                resolve({
                                    result: insertResult,
                                    message: `Registration initiated. OTP sent to  ${registration_email}. Successfully`
                                });
                            });
                        });
                    });
                });
            });
        });
    },// Api for motion add dealer registration


    motion_add_dealer_registration_routes: (dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country, state,
        city, address, postal_code) => {
        return new Promise((resolve, reject) => {
            dealer_Code = generateRandomCode();
            const checkQuery = `SELECT * FROM motion_add_dealer_registration WHERE dealer_Code = ? OR dealer_GST = ?`;
            connection.execute(checkQuery, [dealer_Code, dealer_GST], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Error checking existing records.');
                }

                if (checkResult.length > 0) {
                    return reject('Dealer with same Code or GST already exists. Duplicate entry not allowed. error 1062');
                }
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
                    const insertedId = insertresult.insertId;
                    // Fetch the inserted row
                    const fetchQuery = `SELECT * FROM motion_add_dealer_registration`;
                    connection.execute(fetchQuery, [insertedId], (fetchError, fetchResult) => {
                        if (fetchError) {
                            console.error(fetchError);
                            return reject(`Inserted but failed to fetch data. ${fetchError}`);
                        }
                        // Return the inserted row
                        resolve({ message: "Dealer Registered Successfully", data: fetchResult[0] });
                    })
                    // resolve(insertresult);
                })
            })
        })
    },    // Api for motion purchase row material  -----  FETCHING DATA  -------------
    motion_purchase_row_material_routes: (purchase_id, order_id, dealer_name, material_type, postal_code,
        password, country, state, city, address, freight, material_amount, material_amount_remaining) => {
        return new Promise((resolve, reject) => {
            purchase_id = generate8DigitCode();
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
                        console.log(insertErr, "insertErr")
                        return reject(`Something went wrong while inserting data.${insertErr}`);
                    }
                    const insertedId = insertResult.insertId;
                    const fetchQuery = `select * from motion_purchase_row_material`;
                    connection.execute(fetchQuery, [insertedId], (fetchError, fetchResult) => {
                        if (fetchError) {
                            console.error(fetchError);
                            return reject(`Inserted but failed to fetch data. ${fetchError}`);
                        }
                        resolve({ message: "Purchase Row Material Registered Successfully & Data Fetched", data: fetchResult[0] })
                    })
                    // resolve(insertResult);
                })
            })
        })
    },// Api for motion employee registration    -----  FETCHING DATA  -------------
    motion_employee_registration_routes: (emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email) => {
        return new Promise((resolve, reject) => {
            emp_id = generate6DigitCode();
            emp_code = generateRandomCode();

            const checkQuery = `select * from motion_employee_registration where emp_id = ? or emp_code = ?`;
            connection.execute(checkQuery, [emp_id, emp_code], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Getting Existing Records.')
                }
                if (checkResult.length > 0) {
                    return reject(`Employee id or Employees Code exists. Duplicate entry not allow. 1062`)
                }
            })
            const insertQuery = `insert into motion_employee_registration 
            (emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [emp_id, emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email];
            connection.execute(insertQuery, values, (insertErr, insertResult) => {
                if (insertErr) {
                    return reject(`Data, Inserting error ${insertErr}`);
                }
                const insertedId = insertResult.insertId;
                const fetchQuery = `select * from motion_employee_registration`;
                connection.execute(fetchQuery, [insertedId], (fetchError, fetchResult) => {
                    if (fetchError) {
                        return reject(`Inserted But Failed to Fetch Data. ${fetchError}`);
                    }
                    resolve({ message: `Employee Registered Successfully & Data Fetched`, data: fetchResult[0] });
                })
            })
        })
    },// Api for motion product manufacturing        -----  FETCHING DATA  -------------
    motion_product_manufacturing_routes: (mfr_id, product_name, material_type_one, material_quantity, material_quality, unit, batch_number,
        supervisor_name, total_cost, remarks, created_by, last_modified_by) => {
        return new Promise((resolve, reject) => {
            mfr_id = generate6DigitCode();
            const checkQuery = `select * from motion_product_manufacturing where mfr_id = ?`;
            connection.execute(checkQuery, [mfr_id], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Getting existing records.');
                }
                if (checkResult.length > 0) {
                    return reject(`Manufacturing Id already Exists. Duplicate entry not allow`);
                }
            })

            const insertQuery = `insert into motion_product_manufacturing ( mfr_id, product_name, material_type_one, material_quantity, material_quality, 
                unit, batch_number, supervisor_name, total_cost, remarks, created_by, last_modified_by) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
            const insertValues = [
                mfr_id, product_name, material_type_one, material_quantity, material_quality, unit, batch_number, supervisor_name, total_cost, remarks,
                created_by, last_modified_by
            ];
            connection.execute(insertQuery, insertValues, (insertErr, insertResult) => {
                if (insertErr) {
                    return reject(`Error While Inserting Data. ${insertErr}`);
                }
                const insertedId = insertResult.insertId;
                const fetchQuery = `select * from motion_product_manufacturing`;
                connection.execute(fetchQuery, [insertedId], (fetchError, fetchResult) => {
                    if (fetchError) {
                        return reject(`Failed to Fetch Data after Insertion. ${fetchError}`);
                    }
                    resolve({ message: `Product Manufacturing Registered Successfully & Data Fetched`, data: fetchResult[0] });
                })
            })
        })
    },// Api for motion parties registration          -----  FETCHING DATA  -------------
    motion_parties_registration_routes: (party_id, organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan) => {
        return new Promise((resolve, reject) => {
            party_id = generate6DigitCode();
            const checkQuery = `select * from motion_parties_registration where gst = ? OR party_id = ?`;
            connection.execute(checkQuery, [party_id, gst], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject(`Getting existing Records.`);
                }
                if (checkResult.length > 0) {
                    return reject('GST or Party ID already exists. Duplicate entry not allow.');
                }
            })
            const insertQuery = `insert into motion_parties_registration (party_id,
            organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan) values (?,?,?,?,?,?,?,?,?,?,?,?)`;

            const insertValues = [
                party_id, organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan

            ];
            connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    // console.log(insertError, "insertError")
                    return reject(`Error while inserting Data.${insertError}`)
                }
                const insertedId = insertResult.insertId;
                const fetchQuery = `select * from motion_parties_registration`;
                connection.execute(fetchQuery, [insertedId], (fetchError, fetchResult) => {
                    if (fetchResult) {
                        return reject(`Error While fetching The Data. ${fetchError}`);
                    }
                    resolve({ data: insertResult, message: `Parties Data Fetched successfully. ` });
                })
            })
        })
    },// Api for motion dispatch product      
    motion_dispatch_product_routes: (dispatch_id, dispatch_code, organization_name, owner_name, mobile, email, product_name, product_type,
        quantity, height, width, color, packing_type, dispatch_mode, address, city, state, country, postal_code, gst, freight) => {
        return new Promise((resolve, reject) => {
            const dispatch_id = generate6DigitCode();
            const checkQuery = `select * from motion_dispatch_product where dispatch_id = ? or dispatch_code = ?`;
            connection.execute(checkQuery, [dispatch_id, dispatch_code], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Error while inserting the data.');
                }
                if (checkResult.length > 0) {
                    return reject('Matching Dispatch Id or Dispatch Code. Duplicate entry not allow. Code: 1062')
                }
            })
            const insertQuery = `insert into motion_dispatch_product 
                (dispatch_id, dispatch_code, organization_name, owner_name, mobile, email, product_name, product_type,
                quantity, height, width, color, packing_type, dispatch_mode, address, city, state, country, postal_code, gst, freight)
                values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            const insertValues = [
                dispatch_id, dispatch_code, organization_name, owner_name, mobile, email, product_name, product_type,
                quantity, height, width, color, packing_type, dispatch_mode, address, city, state, country, postal_code, gst, freight
            ];
            connection.execute(insertQuery, insertValues, (insertErr, insertResult) => {
                if (insertErr) {
                    return reject(`Error while inserting data. ${insertErr}`);
                }
                resolve(insertResult);
            })
        })
    },//    Api for motion product category
    motion_product_category_routes: (category_name, description) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `select * from motion_product_category where category_name = ?`;
            connection.execute(checkQuery, [category_name], (checkQueryError, checkQueryResult) => {
                if (checkQueryError) {
                    return reject(`Error while inserting records. ${checkQueryError}`);
                }
                if (checkQueryResult.length > 0) {
                    return reject(`Product Name or Id already exists. Duplicate Entry Not Allowed.`);
                }
            })
            const insertQuery = `insert into motion_product_category (category_name, description) values ( ?,? )`;
            const insertValues = [category_name, description];
            connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    return reject(`Error while inserting the data. ${insertError}`);
                }
                resolve(insertResult);
            })
        });
    },// Api for motion product category
    motion_product_subcategories_routes: (sub_category_name, description, category_id) => {
        return new Promise((resolve, reject) => {
            id = fourDigitCode();
            const checkQuery = `select * from motion_product_subcategories where sub_category_name = ? or category_id = ?`;
            // Check for existing product name or cat_id
            connection.execute(checkQuery, [sub_category_name, category_id], (checkQueryError, checkQueryResult) => {
                if (checkQueryError) {
                    return reject(`Error while inserting records. ${checkQueryError}`);
                }
                if (checkQueryResult.length > 0) {
                    return reject(`Sub Category Name or Id already exists. Duplicate Entry Not Allowed.1062`);
                }
            })
            const insertQuery = `insert into motion_product_subcategories (sub_category_name, description, category_id ) values ( ?, ?,? )`;
            const insertValues = [sub_category_name, description, category_id];
            connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    return reject(`Error While Inserting the data. ${insertError}.`);
                }
                // console.log(insertResult, "insertError");
                resolve(insertResult);
            })
        })
    },
    motion_product_sub_subcategories_routes: (sub_sub_category_name, description, sub_category_id) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `select * from motion_product_sub_subcategories where sub_sub_category_name = ? or sub_category_id = ?`;
            // Check for existing product name or cat_id
            connection.execute(checkQuery, [sub_sub_category_name, sub_category_id], (checkQueryError, checkQueryResult) => {
                if (checkQueryError) {
                    return reject(`Error while inserting the records. ${checkQueryError}`);
                }
                if (checkQueryResult.length > 0) {
                    return reject(`Sub Sub Category Name or Id already exists. Duplicate Entry Not Allowed.1062`);
                }
            })
            const insertQuery = `insert into motion_product_sub_subcategories (sub_sub_category_name, description, sub_category_id) values (?,?,?)`;
            const insertValues = [sub_sub_category_name, description, sub_category_id];
            connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    return reject(`Error While Inserting the data. ${insertError}.`);
                }
                resolve(insertResult);
            })
        })
    },
    motion_products_routes: (product_name, category_id, sub_category_id, sub_sub_category_id, price) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `select * from motion_products where product_name = ? or
            category_id = ? or sub_category_id = ? or sub_sub_category_id = ?`;
            // Check for existing product name or cat_id
            connection.execute(checkQuery, [product_name, category_id, sub_category_id, sub_sub_category_id], (checkQueryError, checkQueryResult) => {
                if (checkQueryError) {
                    return reject(`Error while inserting records. ${checkQueryError}`);
                }
                if (checkQueryResult.length > 0) {
                    return reject(`Product Name or Id already exists. Duplicate Entry Not Allowed.1062`);
                }
            })
            const insertQuery = `insert into motion_products (product_name, category_id, sub_category_id, sub_sub_category_id, price) values (?,?,?,?,?)`;
            const insertValues = [product_name, category_id, sub_category_id, sub_sub_category_id,];
            connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    return reject(`Error While Inserting the data. ${insertError}.`);
                }
                resolve(insertResult);
            })
        })
    },




}
