const CryptoJS = require('crypto-js');

exports.encrypt = (text) => {

    return CryptoJS.AES.encrypt(
        text,
        process.env.AES_SECRET
    ).toString();
};

exports.decrypt = (cipherText) => {

    const bytes = CryptoJS.AES.decrypt(
        cipherText,
        process.env.AES_SECRET
    );

    return bytes.toString(CryptoJS.enc.Utf8);
};