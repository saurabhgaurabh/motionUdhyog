const connection = require("../config/database");


module.exports = {
    motion_add_dealer_registration_get_routes: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM motion_add_dealer_registration`;
            connection.execute(query, [], (error, result) => {
                if (error) {
                    console.log(error, "get")
                    return reject('Something went wrong while fetching data.');
                }
                // console.log(result, "get operations")
                resolve({ result: result, message: 'Dealer Registration Data Fetched Successfully.' });
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
                resolve({ data: getResult, message: `Purchase Row Material Data Fetched Successfully.` });
            })
        })
    },
    motion_employee_registration_get_routes: () => {
        return new Promise((resolve, reject) => {
            const employeeQuery = `select * from motion_Employee_registration`;
            connection.execute(employeeQuery, [], (queryError, queryResult) => {
                if (queryError) {
                    return reject(`Something Went Wrong While Fetching The Employees Registration Data. ${queryError}`);
                }
                resolve({ result: queryResult, message: `Employee Registration Data Fetched Successfully.` });
            })
        })
    },
    motion_product_manufacturing_get_routes: () => {
        return new Promise((resolve, reject) => {
            const productManufacturingQuery = `select * from motion_product_manufacturing`;
            connection.execute(productManufacturingQuery, [], (prd_maf_error, pd_maf_result) => {
                if (prd_maf_error) {
                    return reject(`Something Went Wrong While Fetching The Product Manufacturing Data. ${prd_maf_error}`);
                }
                resolve({ result: pd_maf_result, message: 'Product Manufacturing Data Fetched Successfully.' });
            })
        })
    },
    motion_parties_registration_get_routes: () => {
        return new Promise((resolve, reject) => {
            const partiesQuery = `select * from motion_parties_registration`;
            connection.execute(partiesQuery, [], (partiesError, partiesResult) => {
                if (partiesError) {
                    return reject(`Something went wrong while fetching the Parties Data. ${partiesError}`);
                }
                resolve({ result: partiesResult, message: `Parties Data Fetched Successfully.` });
            })
        })
    },
    motion_dispatch_product_get_routes: () => {
        return new Promise((resolve, reject) => {
            const dispatchProductQuery = `select * from motion_dispatch_product`;
            connection.execute(dispatchProductQuery, [], (dispatchProductError, dispatchProductResult) => {
                if (dispatchProductError) {
                    return reject(`Something went wrong while fetching the Data. ${dispatchProductError}`);
                }
                resolve({ result: dispatchProductResult, message: `Dispatch Product Data Fetched successfully.` });
            })
        })
    },
    motion_product_category_get_routes: () => {
        return new Promise((resolve, reject) => {
            const productCategoryQuery = `
            SELECT 
                p.product_id, p.product_name, p.product_description, p.price, p.created_at,
                c.category_id, c.category_name,
                sc.sub_category_id, sc.sub_category_name,
                ssc.sub_sub_category_id, ssc.sub_sub_category_name
            FROM motion_products AS p
            JOIN motion_product_category AS c ON p.category_id = c.category_id
            JOIN motion_product_subcategories AS sc ON p.sub_category_id = sc.sub_category_id
            JOIN motion_product_sub_subcategories AS ssc ON p.sub_sub_category_id = ssc.sub_sub_category_id
        `;
            connection.execute(productCategoryQuery, [], (productCategoryError, productCategoryResult) => {
                if (productCategoryError) {
                    return reject(`Something went wrong while fetching the data. ${productCategoryError}`);
                }

                resolve({
                    result: productCategoryResult,
                    status: true,
                    message: "Product Category Fetched Successfully."
                });
            });
        });
    },
    motion_product_subcategories_get_routes: () => {
        return new Promise((resolve, reject) => {
            const subCategoryQuery = `
            SELECT 
                p.product_id, p.product_name, p.product_description, p.price, p.created_at,
                c.category_id, c.category_name,
                sc.sub_category_id, sc.sub_category_name,
                ssc.sub_sub_category_id, ssc.sub_sub_category_name
            FROM motion_products AS p
            JOIN motion_product_category AS c ON p.category_id = c.category_id
            JOIN motion_product_subcategories AS sc ON p.sub_category_id = sc.sub_category_id
            JOIN motion_product_sub_subcategories AS ssc ON p.sub_sub_category_id = ssc.sub_sub_category_id`;
            connection.execute(subCategoryQuery, [], (subCategoryError, subCategoryResult) => {
                if (subCategoryError) {
                    return reject(509).json({
                        status: false,
                        message: `Something went wrong while fetching the data. ${subCategoryError}`
                    })
                }
                resolve({ result: subCategoryResult, status: true, message: `Sub Category Data Fetched Succeed.` })
            })
        })
    },
    motion_product_sub_subcategories_get_routes: () => {
        return new Promise((resolve, reject) => {
            const sub_subCategoryQuery = `
            SELECT 
                p.product_id, p.product_name, p.product_description, p.price, p.created_at,
                c.category_id, c.category_name,
                sc.sub_category_id, sc.sub_category_name,
                ssc.sub_sub_category_id, ssc.sub_sub_category_name
            FROM motion_products AS p
            JOIN motion_product_category AS c ON p.category_id = c.category_id
            JOIN motion_product_subcategories AS sc ON p.sub_category_id = sc.sub_category_id
            JOIN motion_product_sub_subcategories AS ssc ON p.sub_sub_category_id = ssc.sub_sub_category_id`;
            connection.execute(sub_subCategoryQuery, [], (sub_subCategoryError, sub_subCategoryResult) => {
                if (sub_subCategoryError) {
                    return reject(509).json({
                        status: false,
                        message: `Something went wrong while fetching the data. ${sub_subCategoryError}`
                    })
                }
                resolve({ result: sub_subCategoryResult, status: true, message: `Sub Category Data Fetched Succeed.` })
            })
        })
    },
    motion_products_get_routes: () => {
        return new Promise((resolve, reject) => {
            const productQuery = `select * from motion_products`;
            connection.execute(productQuery, [], (productError, productResult) => {
                if (productError) {
                    reject(`Something went wrong while fetching data. ${productError}`);
                }
                resolve({ result: productResult, message: `Products Data Fetched.`, status: true })
            })
        })
    }

}