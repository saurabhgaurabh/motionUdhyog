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
                console.log(result, "get operations")
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
    }
}