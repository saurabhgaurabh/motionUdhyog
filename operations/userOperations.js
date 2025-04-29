// const connection = require('../config/database');

// module.exports = {
//     udhyog_registration : (name, city, postal_code) =>{
//         return new Promise((resolve, reject)=>{
//             const query= `SELECT * FROM udhyog_registration (name, city, postal_code) VALUES (?,?,?)`;
//             connection.execute(query,[name, city, postal_code], (error, result)=>{
//                 if (error) {
//                     console.log(error);
//                     return reject('Something went wrong.');
//                 }
//                 resolve(result);
//             });
//         });
//     }
// }

const connection = require('../config/database');

module.exports = {
    udhyog_registration: (name, city, postal_code) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO udhyog_registration (name, city, postal_code) VALUES (?, ?, ?)`;
            connection.execute(query, [name, city, postal_code], (error, result) => {
                if (error) {
                    console.log(error);
                    return reject('Something went wrong.');
                }
                resolve(result);
            });
        });
    }
}
