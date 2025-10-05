const getOperations = require("../operations/getOperations");

module.exports = {
    motion_add_dealer_registration_get_routes: async (req, res) => {
        try {
            const result = await getOperations.motion_add_dealer_registration_get_routes();
            // console.log(result, "dealer get")
            return res.status(200).json({ status: true, message: 'Dealer Registration Data Fetched Successfully.', result: result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error Get. ${error}` });
        }
    }, // motion_add_dealer_registration_get_routes
    motion_purchase_row_material_get_routes: async (req, res) => {
        try {
            const materialResult = await getOperations.motion_purchase_row_material_get_routes();
            return res.status(200).json({ status: true, message: `Purchase Row Material Data Fetched Successfully.`, result: materialResult });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    },
    motion_employee_registration_get_routes: async (req, res) => {
        try {
            const employeeResult = await getOperations.motion_employee_registration_get_routes();
            return res.status(200).json({ status: true, message: `Employee Registration Data FEtched Successfully.`, result: employeeResult });
        } catch (error) {
            return res.status(500).json({ status: false, messsage: `Internal Server Error. ${error}` });
        }
    },
    motion_product_manufacturing_get_routes: async (req, res) => {
        try {
            const prd_maf_result = await getOperations.motion_product_manufacturing_get_routes();
            return res.status(200).json({ status: true, message: 'Product Manufacturing Data Fetched Successfully.', result: prd_maf_result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    },
    motion_parties_registration_get_routes: async (req, res) => {
        try {
            const parties_result = await getOperations.motion_parties_registration_get_routes();
            return res.status(200).json({ status: true, message: `Parties Fetched Successfully.`, result: parties_result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error.${error}` });
        }
    },
    motion_dispatch_product_get_routes: async (req, res) => {
        try {
            const dsp_prd_result = await getOperations.motion_dispatch_product_get_routes();
            return res.status(200).json({ status: false, message: `Dispatched Product Fetched Successfully.`, result: dsp_prd_result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error. ${error}` });
        }
    },
    motion_product_category_get_routes: async (req, res) => {
        try {
            const productCategoryResult = await getOperations.motion_product_category_get_routes();
            // console.log(productCategoryResult," pro result")
            return res.status(200).json({ status: false, message: `Product Category Fetched Successfully.`, result: productCategoryResult });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Errors. ${error}` });
        }
    },
    motion_product_subcategories_get_routes: async (req, res) => {
        try {
            const subCategoryResult = await getOperations.motion_product_subcategories_get_routes();
            return res.status(200).json({ status: true, message: `sub Category Fetched Successfully.`, result: subCategoryResult })
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Errors. ${error}` });
        }
    },
    motion_product_sub_subcategories_get_routes: async (req, res) => {
        try {
            const sub_subCategoryResult = await getOperations.motion_product_sub_subcategories_get_routes();
            return res.status(200).json({
                status: true, message: `sub Category Fetched Successfully.`,
                result: sub_subCategoryResult
            })
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Errors. ${error}` });
        }
    },
    motion_products_get_routes: async (req, res) => {
        try {
            const productResult = await getOperations.motion_products_get_routes();
            return res.status(200).json({ status: true, message: `Product Data Fetched.`, result: productResult });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Errors. ${error}` });

        }
    },
    motion_daily_tasks_get_routes: async (req, res) =>{
        try {
            const dailyTaskResult = await getOperations.motion_daily_tasks_get_routes();
            return res.status(200).json({ status: true, message: `Daily Tasks Data Fetched Successfully.`, result: dailyTaskResult });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Errors. ${error}` });
        }
    }
}