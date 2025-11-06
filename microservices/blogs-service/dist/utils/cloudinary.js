"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBuffer = uploadBuffer;
exports.deleteByPublicId = deleteByPublicId;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
async function uploadBuffer(buffer, folder = "blogs") {
    // cloudinary.uploader.upload_stream expects a callback. We wrap it in a Promise.
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder }, (err, result) => {
            if (err)
                return reject(err);
            if (!result)
                return reject(new Error("No result from cloudinary"));
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
        });
        stream.end(buffer);
    });
}
async function deleteByPublicId(public_id) {
    return cloudinary_1.v2.uploader.destroy(public_id);
}
