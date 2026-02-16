const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer - The file buffer from multer (req.file.buffer)
 * @param {Object} options - Cloudinary upload options (folder, etc.)
 * @returns {Promise} - Cloudinary upload result
 */
const uploadFromBuffer = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        stream.end(buffer);
    });
};

module.exports = {
    uploadFromBuffer
};
