const connection = require('../config/database');
const { generateRandomId, generateRandomCode, generatePurchaseId, fourDigitCode, generateManufacturingId, generate8DigitCode, generate6DigitCode, randomUserCode } = require('../utils/helper');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const speakeasy = require('speakeasy');
const { promises } = require('nodemailer/lib/xoauth2');

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
        company_name, owner_name, industry_type, GST_number, registration_email,
        mobile_number, password, confirm_password, country, state, city, address, postal_code, website
    ) => {
        return new Promise((resolve, reject) => {
            const userCode = randomUserCode();
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
                    html: `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
                       <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
                            <h2 style="color: #4CAF50;">Welcome to ApkaUdhyog.com!</h2>      
                                <p>Hi <strong>${owner_name}</strong>,</p>      
                                <p>We’re excited to have <strong>${company_name}</strong> join the ApkaUdhyog platform.</p>      
                                <p>To complete your registration, please use the following One-Time Password (OTP):</p>      
                            <div style="text-align: center; margin: 20px 0;">
                                <span style="display: inline-block; background: #4CAF50; color: white; font-size: 24px; padding: 12px 24px; border-radius: 6px; letter-spacing: 2px;"> ${userOTP}</span>
                            </div>      
                                <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>                    
                                <p>If you didn’t initiate this request, please ignore this message or contact our support team.</p><br>
                                <p>Regards,</p>
                                <p><strong>Team ApkaUdhyog</strong></p>
                                <p style="font-size: 12px; color: #999;">www.apkaudhyog.com | support@apkaudhyog.com</p>
                        </div>
                    </div>`
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
                                    // console.error(insertErr," error");
                                    return reject(`Something went wrong while inserting data || Duplicate entry not allowed. Error 1062. ${insertErr} `);
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

    verify_user_otp: (userCode, userOTP) => {
        return new Promise((resolve, reject) => {
            const fetchQuery = `SELECT otp_secret FROM motion_user_registration WHERE userCode = ?`;
            connection.execute(fetchQuery, [userCode], (err, results) => {
                if (err || results.length === 0) {
                    return reject({ status: false, message: 'User not found.' });
                }
                const user = results[0];
                const isVerified = speakeasy.totp.verify({
                    secret: user.otp_secret,
                    encoding: 'base32',
                    token: userOTP,
                    window: 10,
                    step: 300
                });
                if (!isVerified) {
                    return reject({ status: false, message: 'Invalid OTP.' });
                }
                const updateQuery = `UPDATE motion_user_registration SET flag = 'verified' WHERE userCode = ?`;
                connection.execute(updateQuery, [userCode], (updateErr) => {
                    if (updateErr) {
                        return reject({ status: false, message: 'Verification failed while updating user.' });
                    }
                    resolve({ status: true, message: 'User verified successfully.' });
                });
            });
        })
    },

    user_login: (registration_email, password) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT registration_email, password FROM 
            motion_user_registration WHERE registration_email = ?`;
            connection.execute(query, [registration_email], (err, results) => {
                if (err) {
                    return reject({ status: false, message: 'Database error.' });
                }
                if (results.length === 0) {
                    return reject({ status: false, message: 'User not found.' });
                }
                const user = results[0];
                bcrypt.compare(password, user.password, (compareErr, isMatch) => {
                    if (compareErr || !isMatch) {
                        return reject({ status: false, message: 'Invalid password.' });
                    }
                    resolve({ status: true, message: 'Login successful.', user });
                });
            });
        });
    },
    user_otp_verification: (registration_email, userOTP) => {
        return new Promise((resolve, reject) => {
            const fetchQuery = `SELECT otp_secret FROM motion_user_registration WHERE registration_email = ?`;
            connection.execute(fetchQuery, [registration_email], (err, results) => {
                if (err || results.length === 0) {
                    return reject({ status: false, message: 'User not found.' });
                }
                const user = results[0];
                const isVerified = speakeasy.totp.verify({
                    secret: user.otp_secret,
                    encoding: 'base32',
                    token: userOTP,
                    window: 10,
                    step: 300
                });
                if (!isVerified) {
                    return reject({ status: false, message: 'Invalid OTP.' });
                }
                const updateQuery = `UPDATE motion_user_registration SET flag = 'verified' WHERE registration_email = ?`;
                connection.execute(updateQuery, [registration_email], (updateErr) => {
                    if (updateErr) {
                        return reject({ status: false, message: 'Verification failed while updating user.' });
                    }
                    resolve({ status: true, message: 'User verified successfully.' });
                });
            });
        });
    },


    motion_add_dealer_registration_routes: (
        dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, dealing_product, email,
        country, state, city, address, postal_code) => {
        return new Promise((resolve, reject) => {
            dealer_Code = generateRandomCode();
            const checkQuery = `SELECT 
            dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, dealing_product, email, 
         country, state, city, address, postal_code  FROM 
            motion_add_dealer_registration WHERE dealer_Code = ? OR dealer_GST = ? order by dealer_id desc`;
            connection.execute(checkQuery, [dealer_Code, dealer_GST], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Error checking existing records.');
                }

                if (checkResult.length > 0) {
                    return reject('Dealer with same Code or GST already exists. Duplicate entry not allowed. error 1062');
                }
                const insertQuery = `INSERT INTO motion_add_dealer_registration (
                        dealer_Code, dealer_name, dealer_GST, mobile_number,
                        adhar_number, pan, dealing_product, email, country, state,
                        city, address, postal_code
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

                const values = [
                    dealer_Code ?? null, dealer_name ?? null, dealer_GST ?? null, mobile_number ?? null,
                    adhar_number ?? null, pan ?? null, dealing_product ?? null,
                    email ?? null, country ?? null, state ?? null, city ?? null, address ?? null, postal_code ?? null
                ];

                connection.execute(insertQuery, values, (insertErr, insertResult) => {
                    if (insertErr) {
                        return reject(`Something went wrong while inserting data.${insertErr}`);
                    }
                    const insertedId = insertResult.insertId;
                    const fetchQuery = `SELECT * FROM motion_add_dealer_registration order by dealer_id desc`;
                    connection.execute(fetchQuery, [insertedId], (fetchError, fetchResult) => {
                        if (fetchError) {
                            console.error(fetchError);
                            return reject(`Inserted but failed to fetch data. ${fetchError}`);
                        }
                        // Return the inserted row
                        resolve({ message: "Dealer Registered Successfully", data: fetchResult });
                    })
                })
            })
        })
    },    // Api for motion purchase row material  -----  FETCHING DATA  -------------


    addPurchaseWithProducts: (purchaseData, products) => {
        return new Promise((resolve, reject) => {
            const { dealer_name, postal_code, country, state, city, address, freight, total_amount, material_amount,
                material_amount_pending, payment_status } = purchaseData;
            const insertPurchaseQuery = `
            INSERT INTO motion_purchase_row_material
            (dealer_name, postal_code, country, state, city, address, freight, total_amount, material_amount, 
            material_amount_pending, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const paymentStatusValue = payment_status && payment_status.trim() !== "" ? payment_status : "pending";
            const purchaseValues = [
                dealer_name, postal_code ?? null, country, state, city, address, freight, total_amount, material_amount,
                material_amount_pending, paymentStatusValue
            ];

            connection.execute(insertPurchaseQuery, purchaseValues, (err, purchaseResult) => {
                if (err) return reject(err);

                const purchase_id = purchaseResult.insertId;

                if (!products || products.length === 0) return resolve({ purchase_id });

                // Multiple products
                const insertProductsQuery = `
                INSERT INTO motion_purchase_products
                (purchase_id, product_name, quantity, price, total_amount)
                VALUES ?
            `;
                const productValues = products.map(p => [
                    purchase_id,
                    p.product_name,
                    parseFloat(p.quantity) || 0,
                    parseFloat(p.price) || 0,
                    parseFloat(p.total_amount) || 0
                ]);

                connection.query(insertProductsQuery, [productValues], (prodErr, prodResult) => {
                    if (prodErr) return reject(prodErr);
                    resolve({ purchase_id, productsInserted: prodResult.affectedRows });
                });
            });
        });
    },

    motion_employee_registration_routes: (employee_name, dob, state, city, address, postal_code, qualification, adhar,
        pan, mobile, email, department, designation, salary) => {
        return new Promise((resolve, reject) => {
            // emp_id = generate6DigitCode();
            emp_code = generateRandomCode();

            const checkQuery = `select * from motion_employee_registration where email = ? or emp_code = ?`;
            connection.execute(checkQuery, [email, emp_code], (checkErr, checkResult) => {
                if (checkErr) {
                    return reject('Getting Existing Records.')
                }
                if (checkResult.length > 0) {
                    return reject(`E-Mail or Employees Code exists. Duplicate entry not allow. 1062`)
                }
            })
            const insertQuery = `insert into motion_employee_registration 
            (emp_code, employee_name, dob, state, city, address, postal_code, qualification, adhar, pan, mobile, 
            email, department, designation, salary)  values (?,?, ?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [
                emp_code, employee_name ?? null, dob ?? null, state ?? null, city ?? null, address ?? null, postal_code ?? null,
                qualification ?? null, adhar ?? null, pan ?? null, mobile ?? null, email ?? null, department ?? null,
                designation ?? null, salary ?? null
            ];
            connection.execute(insertQuery, values, (insertErr, insertResult) => {
                if (insertErr) {
                    return reject(`Data, Inserting error ${insertErr}`);
                }
                resolve({ message: `Employee Registered Successfully & Data Fetched`, data: insertResult });
            })
        })
    },// Api for motion product manufacturing        -----  FETCHING DATA  -------------
    motion_product_manufacturing_routes: (product_name, material_type_one, material_quantity, material_quality, unit, batch_number,
        supervisor_name, total_cost, remarks) => {
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

            const insertQuery = `insert into motion_product_manufacturing (  product_name, material_type_one, material_quantity, material_quality, 
                unit, batch_number, supervisor_name, total_cost, remarks) values (?,?,?,?,?,?,?,?,?)`;
            const insertValues = [
                product_name, material_type_one, material_quantity, material_quality, unit, batch_number, supervisor_name, total_cost, remarks,
            ];
            connection.execute(insertQuery, insertValues, (insertErr, insertResult) => {
                if (insertErr) {
                    return reject(`Error While Inserting Data. ${insertErr}`);
                }
                const fetchQuery = `SELECT * FROM motion_product_manufacturing WHERE mfr_id = ?`;
                connection.execute(fetchQuery, [mfr_id], (fetchErr, fetchResult) => {
                    if (fetchErr) {
                        return reject(`Inserted but failed to fetch data. ${fetchErr}`);
                    }
                    resolve({ message: `Product Manufacturing Registered Successfully & Data Fetched`, data: fetchResult[0] });
                })
            })
        })
    },// Api for motion parties registration          -----  FETCHING DATA  -------------

    motion_parties_registration_routes: (organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan) => {
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
            const insertQuery = `insert into motion_parties_registration (
            organization_name, owner_name, mobile, email, gst, country, state, city, address, adhar, pan) values 
            (?,?,?,?,?,?,?,?,?,?,?)`;

            const insertValues = [
                organization_name || null, owner_name || null, mobile || null, email || null, gst || null,
                country || null, state || null, city || null, address || null, adhar || null, pan || null

            ];
            connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    // console.log(insertError, "insertError")
                    return reject(`Error while inserting Data.${insertError}`)
                }
                resolve({ data: insertResult, message: `Parties Data Inserted successfully. ` });
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
                const insertedId = insertResult.insertId;
                const fetchQuery = `select * from motion_product_category`
                connection.execute((fetchQuery), [insertedId], (fetchError, fetchResult) => {
                    if (fetchError) {
                        return reject(`inserted but failed to get data. ${fetchError}`);
                    }
                    resolve({ message: 'Get Categories.', CatResult: fetchResult });
                })

            })
        });
    },// Api for motion product category

    // motion_product_subcategories_routes: (sub_category_name, description, category_id) => {
    //     return new Promise((resolve, reject) => {
    //         id = fourDigitCode();
    //         const checkQuery = `select * from motion_product_subcategories where sub_category_name = ? or category_id = ?`;
    //         // Check for existing product name or cat_id
    //         connection.execute(checkQuery, [sub_category_name, category_id], (checkQueryError, checkQueryResult) => {
    //             if (checkQueryError) {
    //                 return reject(`Error while inserting records. ${checkQueryError}`);
    //             }
    //             if (checkQueryResult.length > 0) {
    //                 return reject(`Sub Category Name or Id already exists. Duplicate Entry Not Allowed.1062`);
    //             }
    //         })
    //         const insertQuery = `insert into motion_product_subcategories (sub_category_name, description, category_id ) values ( ?, ?,? )`;
    //         const insertValues = [sub_category_name, description, category_id];
    //         connection.execute(insertQuery, insertValues, (insertError, insertResult) => {
    //             if (insertError) {
    //                 return reject(`Error While Inserting the data. ${insertError}.`);
    //             }
    //             // console.log(insertResult, "insertError");
    //             resolve(insertResult);
    //         })
    //     })
    // },

    motion_product_subcategories_routes: (sub_category_name, description, category_id) => {
        return new Promise((resolve, reject) => {
            const checkQuery = `
            SELECT * 
            FROM motion_product_subcategories 
            WHERE LOWER(sub_category_name) = LOWER(?) AND category_id = ?
        `;
            connection.execute(checkQuery, [sub_category_name, category_id], (checkErr, checkRes) => {
                if (checkErr) {
                    return reject(`Error while checking existing records: ${checkErr}`);
                }

                if (checkRes.length > 0) {
                    return reject("Duplicate Entry Not Allowed: Subcategory already exists under this category.");
                }

                const insertQuery = `
                INSERT INTO motion_product_subcategories (sub_category_name, description, category_id)
                VALUES (?, ?, ?)
            `;
                connection.execute(insertQuery, [sub_category_name, description, category_id], (insertErr, insertRes) => {
                    if (insertErr) {
                        return reject(`Error while inserting data: ${insertErr}`);
                    }

                    resolve(insertRes);
                });
            });
        });
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

    motion_daily_tasks: (employee_name, shift, total_hours, remarks) => {
        return new Promise((resolve, reject) => {
            const insertQuery = `INSERT INTO motion_daily_tasks (
            employee_name, shift, total_hours, remarks) VALUES 
            (?, ?, ?, ?)`;
            const insertValues = [
                employee_name, shift, total_hours, remarks
            ];
            connection.execute(insertQuery, insertValues, (insertErr, insertResult) => {
                if (insertErr) {
                    reject(`Error while inserting daily tasks data. ${insertErr}`);
                }
                const task_id = insertResult.insertId;
                const fetchQuery = `SELECT * FROM motion_daily_tasks WHERE task_id = ?`;
                connection.execute(fetchQuery, [task_id], (fetchErr, fetchResult) => {
                    if (fetchErr) {
                        return reject(`Inserted but failed to fetch data. ${fetchErr}`);
                    }
                    resolve({ status: true, message: 'Daily tasks registered successfully.', data: fetchResult[0] });
                })// resolve({ status: true, message: 'Daily tasks registered successfully.', data: insertResult });
            })
        })
    },

    motion_sales_routes: (customer_name, company, products, grand_total, payment_status, remarks) => {
        return new Promise((resolve, reject) => {
            // 1) Insert sale master row
            const insertSaleSql = `INSERT INTO motion_sales (customer_name, company, grand_total, payment_status, remarks)
                           VALUES (?, ?, ?, ?, ?)`;
            const saleValues = [
                customer_name ?? null,
                company ?? null,
                grand_total ?? 0,
                payment_status ?? null,
                remarks ?? null,
            ];

            connection.execute(insertSaleSql, saleValues, (saleErr, saleResult) => {
                if (saleErr) return reject(`Error while inserting sale master. ${saleErr}`);

                const sale_id = saleResult.insertId;

                // 2) Prepare bulk values for products
                const productValues = products.map((p) => [
                    sale_id,
                    p.product_name,
                    p.quantity,
                    p.price,
                    p.total_amount ?? (parseFloat(p.quantity || 0) * parseFloat(p.price || 0)).toFixed(2)
                ]);

                if (productValues.length === 0) {
                    // nothing to insert - resolve with sale info
                    return resolve({ status: true, message: 'Sale created but no products to insert.', data: { sale_id } });
                }

                const insertProductsSql = `INSERT INTO motion_sale_products (sale_id, product_name, quantity, price, total_amount) VALUES ?`;

                // use connection.query for bulk VALUES ?
                connection.query(insertProductsSql, [productValues], (prodErr, prodResult) => {
                    if (prodErr) return reject(`Error while inserting sale products. ${prodErr}`);

                    // 3) Fetch inserted sale (optional)
                    const fetchQuery = `SELECT * FROM motion_sales WHERE sale_id = ?`;
                    connection.execute(fetchQuery, [sale_id], (fetchErr, fetchResult) => {
                        if (fetchErr) return reject(`Inserted but failed to fetch data. ${fetchErr}`);

                        resolve({ status: true, message: 'Sales registered successfully.', data: { sale: fetchResult[0], sale_id } });
                    });
                });
            });
        });
    },




}
