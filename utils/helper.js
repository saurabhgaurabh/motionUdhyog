const generateRandomOrderId = () => {
    const timestamp = Date.now(); // current time in ms
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `ORD-${timestamp}-${random}`;
};

const generateDealerCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DEALER-';
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
    generateRandomOrderId, generateDealerCode, generatePurchaseId
}