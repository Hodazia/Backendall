"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => (req, res, next) => {
    try {
        // parse and replace req.body with parsed object
        req.body = schema.parse(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({ message: "Validation failed", errors: err.errors ?? err });
    }
};
exports.validateBody = validateBody;
