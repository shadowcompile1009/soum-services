function PaymentService(DAL) {

    function decryptingBody(httpBody, ivfromHttpHeader, authTagFromHttpHeader) {
        try {
            var crypto = require("crypto");
            // Convert data to process
            var key = new Buffer(ENV.WEBHOOK_SECRET, "hex");
            var iv = new Buffer(ivfromHttpHeader, "hex");
            var authTag = new Buffer(authTagFromHttpHeader, "hex");
            var cipherText = new Buffer(httpBody, "hex");

            // Prepare descryption
            var decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
            decipher.setAuthTag(authTag);
            // Decrypt
            var result = decipher.update(cipherText) + decipher.final();

            return result;
        } catch (error) {
            console.log(error)
        }
    }

    async function create(data) {
        return await DAL.PaymentStatusDAL.create(data);
    }

    return {
        decryptingBody,
        create
    }
}

module.exports = PaymentService