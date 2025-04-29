const userOperations = require('../operations/userOperations');
module.exports = {
    udhyog_registration: async (req, res) => {
        try {
            const { name, city, postal_code } = req.body;
            if (!name) return res.status(200).json({ status: false, message: 'Name is require.' });
            if (!city) return res.status(200).json({ status: false, message: 'City is required.' });
            if (!postal_code) return res.status(200).json({ status: false, message: 'Postal code is required.' });            

            const result = await userOperations.udhyog_registration(name, city, postal_code);
            console.log(result, 'result')
            return res.status(201).json({ status: true, message: "Registration successful!", result: result });

        } catch (error) {
            return res.status(509).json({ result: [], status: false, message: `Internasl Server Error ${error}` })
        }
    }
}