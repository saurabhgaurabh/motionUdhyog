
// long randome code
const generateRandomId = () => {
    const timestamp = Date.now(); // current time in ms
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `ORD-${timestamp}-${random}`;
};

const generateManufacturingId = () => {
    const timestamp = Date.now(); // current time in ms
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `MFG-${timestamp}-${random}`;
};

// 4 digin code
const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DEALER-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const fourDigitCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'MFR-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const generatePurchaseId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DEALER-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

module.exports = {
    generateRandomId, generateRandomCode, generatePurchaseId, generateManufacturingId, fourDigitCode
}