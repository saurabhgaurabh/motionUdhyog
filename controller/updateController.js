const updateOperations = require('../operations/updateOperations');

module.exports = {
    update_dealer_registration: async (req, res) => {
        try {
            const requiredFields = [
                'dealer_Code', 'dealer_name', 'dealer_GST', 'mobile_number', 'adhar_number', 'pan', 'password',
                'country', 'state', 'city', 'address', 'postal_code'
            ];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ status: false, message: `${field.replace(/_/g, ' ')} is required.` });
                }
            }
            const {
                dealer_Code, dealer_name, dealer_GST, mobile_number, adhar_number, pan, password, country,
                state, city, address, postal_code
            } = req.body;

            const result = await updateOperations.update_dealer_registration(
                dealer_Code, dealer_name, dealer_GST, mobile_number,
                adhar_number, pan, password, country,
                state, city, address, postal_code
            );
            return res.status(200).json({ status: true, message: result.message, result: result.result });
        }
        catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error While Update. ${error}` });
        }
    },
    motion_purchase_row_material_update: async (req, res) => {
        try {
            const requiredFields = ['order_id', 'dealer_name', 'material_type', 'postal_code', 'password', 'country',
                'state', 'city', 'address', 'freight', 'material_amount', 'material_amount_remaining'
            ];
            for (const fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(400).json({ status: false, message: `${fields.replace(/_/g, ' ')} is required.` });
                }
            }
            const { order_id, dealer_name, material_type, postal_code, password, country, state,
                city, address, freight, material_amount, material_amount_remaining
            } = req.body;

            const result = await updateOperations.motion_purchase_row_material_update(
                order_id, dealer_name, material_type, postal_code, password, country,
                state, city, address, freight, material_amount, material_amount_remaining
            );
            return res.status(200).json({ status: true, message: `Row Material Updated Successfully`, result: result.result });

        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal Server Error While Update. ${error}` });
        }
    },
    motion_employee_registration_update: async (req, res) => {
        try {
            const {
                emp_code, name, state, city, address, postal_code, qualification, adhar, pan, mobile, email
            } = req.body;

            const requiredFields = [
                'emp_code', 'name', 'state', 'city', 'address', 'postal_code', 'qualification',
                'adhar', 'pan', 'mobile', 'email'
            ];
            for (const fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(400).json({ status: false, message: `${fields.replace(/_/g, ' ')} is required` })
                }
            }
            const empRegResult = await updateOperations.motion_employee_registration_update(
                emp_code, name, state, city, address, postal_code, qualification,
                adhar, pan, mobile, email
            );
            return res.status(200).json({ status: true, message: empRegResult.message, result: empRegResult.result });

        } catch (error) {
            return res.status(500).json({
                stratus: false,
                message: `Internal Server Error While Update. ${error}`
            })
        }
    },
    motion_product_manufacturing_update: async (req, res) => {
        try {
            const {
                product_name, material_type_one, material_quantity, material_quality, unit, batch_number,
                supervisor_name, total_cost, remarks,mfr_id } = req.body;
            const requiredFields = [
                'product_name', 'material_type_one', 'material_quantity', 'material_quality', 'unit',
                'batch_number', 'supervisor_name', 'total_cost', 'remarks','mfr_id'
            ];
            for (const fields of requiredFields) {
                if (!req.body[fields]) {
                    return res.status(400).json({ status: false, message: `${fields.replace(/_/g, ' ')} is required` });
                }
            };
            const productManufacturingResult = await updateOperations.motion_product_manufacturing_update(
                product_name, material_type_one, material_quantity, material_quality, unit,
                batch_number, supervisor_name, total_cost, remarks,mfr_id
            );
            return res.status(200).json({ status: true, message: `Product Updated Successfully.`, result: productManufacturingResult.result });
        } catch (error) {
            return res.status(500).json({ status: false, message: `Internal server Error while update. ${error}` });
        }
    }

}