const connection = require("../config/database");


module.exports = {
update_dealer_registration: (
    dealer_Code,
    dealer_name,
    dealer_GST,
    mobile_number,
    adhar_number,
    pan,
    password,
    country,
    state,
    city,
    address,
    postal_code
) => {
    return new Promise((resolve, reject) => {
        const updateQuery = `
            UPDATE motion_add_dealer_registration SET
                dealer_name = ?, dealer_GST = ?, mobile_number = ?, 
                adhar_number = ?, pan = ?, password = ?, country = ?, 
                state = ?, city = ?, address = ?, postal_code = ?
            WHERE dealer_Code = ?
        `;

        const values = [
            dealer_name, dealer_GST, mobile_number,
            adhar_number, pan, password, country,
            state, city, address, postal_code,
            dealer_Code // WHERE condition
        ];

        connection.execute(updateQuery, values, (err, result) => {
            if (err) {
                return reject(`Error updating dealer data. ${err}`);
            }
            resolve({ message: "Dealer updated successfully", result });
        });
    });
}

}