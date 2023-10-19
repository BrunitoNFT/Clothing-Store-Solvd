"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeToMilliseconds = exports.verifyToken = exports.signToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const secretKey = process.env.SECRET_PASSWORD || "testingpassword";
const header = {
    alg: "HS256",
    typ: "JWT",
};
const signToken = (payload, options) => {
    let expiresIn = parseTimeToMilliseconds("2mo");
    if (options === null || options === void 0 ? void 0 : options.expiresIn) {
        expiresIn = parseTimeToMilliseconds(options === null || options === void 0 ? void 0 : options.expiresIn);
    }
    const currentTime = Date.now();
    const expirationTime = currentTime + expiresIn;
    const updatedPayload = Object.assign(Object.assign({}, payload), { exp: expirationTime, iat: currentTime });
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
    const encodedPayload = Buffer.from(JSON.stringify(updatedPayload)).toString("base64");
    const signatureInput = encodedHeader + "." + encodedPayload;
    const signature = crypto_1.default
        .createHmac("sha256", secretKey)
        .update(signatureInput)
        .digest("base64");
    const jwt = encodedHeader + "." + encodedPayload + "." + signature;
    return jwt;
};
exports.signToken = signToken;
const verifyToken = (token) => {
    if (typeof token !== "string" || token.split(".").length !== 3) {
        throw new Error("Invalid token format 1");
    }
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    // Decoding
    let header, payload;
    try {
        header = JSON.parse(Buffer.from(encodedHeader, "base64").toString());
        payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString());
    }
    catch (e) {
        throw new Error("Invalid token encoding");
    }
    // Validate header
    if (header.alg !== "HS256" || header.typ !== "JWT") {
        throw new Error("Invalid token header");
    }
    // Re-create the signature
    const newSignatureInput = encodedHeader + "." + encodedPayload;
    const newSignature = crypto_1.default
        .createHmac("sha256", secretKey)
        .update(newSignatureInput)
        .digest("base64");
    // Use constant-time comparison for signatures to prevent timing attacks.
    const bufferA = Buffer.from(newSignature);
    const bufferB = Buffer.from(signature);
    if (bufferA.length !== bufferB.length ||
        !crypto_1.default.timingSafeEqual(bufferA, bufferB)) {
        throw new Error("Invalid signature");
    }
    // Check expiration
    if (payload.exp <= Date.now()) {
        throw new Error("Token has expired");
    }
    delete payload.iat;
    delete payload.exp;
    return payload;
};
exports.verifyToken = verifyToken;
function parseTimeToMilliseconds(timeString) {
    if (!isNaN(Number(timeString))) {
        // Just default miliseconds
        const num = Number(timeString);
        if (num < 0) {
            throw new Error("Invalid time format");
        }
        else if (num.toString().includes(".")) {
            throw new Error("Invalid time format");
        }
        return num;
    }
    // Regular expressions to match time units
    const unitRegex = /(-?\d+(\.\d+)?)\s*(s|mo|m|h|d|w|y)/;
    // Object to map time units to milliseconds
    const unitToMilliseconds = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
        w: 604800000,
        mo: 2592000000,
        y: 31536000000, // years (assuming 365 days in a year)
    };
    // Match the time string against the regular expression
    const match = unitRegex.exec(timeString);
    if (!match) {
        throw new Error("Invalid time format");
    }
    // Extract the quantity and unit from the match
    const quantity = parseFloat(match[1]);
    if (quantity < 0) {
        throw new Error("Invalid time format");
    }
    else if (quantity.toString().includes(".")) {
        throw new Error("Invalid time format");
    }
    const unit = String(match[3]);
    if (!unitToMilliseconds[unit]) {
        throw new Error("Invalid time format");
    }
    // Calculate the total milliseconds
    const milliseconds = quantity * unitToMilliseconds[unit];
    return milliseconds;
}
exports.parseTimeToMilliseconds = parseTimeToMilliseconds;
exports.default = { signToken, verifyToken, parseTimeToMilliseconds };
