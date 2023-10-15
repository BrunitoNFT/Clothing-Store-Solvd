import crypto from "crypto";

const secretKey: string = process.env.SECRET_PASSWORD || "testingpassword";

const header = {
  alg: "HS256",
  typ: "JWT",
};

const signToken = (
  payload: Record<string, unknown>,
  options?: { expiresIn: string }
) => {
  let expiresIn = parseTimeToMilliseconds("2mo");
  if (options?.expiresIn) {
    expiresIn = parseTimeToMilliseconds(options?.expiresIn);
  }

  const currentTime = Date.now();
  const expirationTime = currentTime + expiresIn;

  const updatedPayload = {
    ...payload,
    exp: expirationTime,
    iat: currentTime,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
  const encodedPayload = Buffer.from(JSON.stringify(updatedPayload)).toString(
    "base64"
  );

  const signatureInput = encodedHeader + "." + encodedPayload;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureInput)
    .digest("base64");

  const jwt = encodedHeader + "." + encodedPayload + "." + signature;

  return jwt;
};

const verifyToken = (token: string): Record<string, unknown> => {
  if (typeof token !== "string" || token.split(".").length !== 3) {
    throw new Error("Invalid token format 1");
  }

  const [encodedHeader, encodedPayload, signature] = token.split(".");

  // Decoding
  let header, payload;
  try {
    header = JSON.parse(Buffer.from(encodedHeader, "base64").toString());
    payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString());
  } catch (e) {
    throw new Error("Invalid token encoding");
  }

  // Validate header
  if (header.alg !== "HS256" || header.typ !== "JWT") {
    throw new Error("Invalid token header");
  }

  // Re-create the signature
  const newSignatureInput = encodedHeader + "." + encodedPayload;
  const newSignature = crypto
    .createHmac("sha256", secretKey)
    .update(newSignatureInput)
    .digest("base64");

  // Use constant-time comparison for signatures to prevent timing attacks.
  const bufferA = Buffer.from(newSignature);
  const bufferB = Buffer.from(signature);

  if (
    bufferA.length !== bufferB.length ||
    !crypto.timingSafeEqual(bufferA, bufferB)
  ) {
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

function parseTimeToMilliseconds(timeString: string): number {
  if (!isNaN(Number(timeString))) {
    // Just default miliseconds
    const num = Number(timeString);
    if (num < 0) {
      throw new Error("Invalid time format");
    } else if (num.toString().includes(".")) {
      throw new Error("Invalid time format");
    }
    return num;
  }
  // Regular expressions to match time units
  const unitRegex = /(-?\d+(\.\d+)?)\s*(s|mo|m|h|d|w|y)/;

  // Object to map time units to milliseconds
  const unitToMilliseconds: Record<string, number> = {
    s: 1000, // seconds
    m: 60000, // minutes
    h: 3600000, // hours
    d: 86400000, // days
    w: 604800000, // weeks
    mo: 2592000000, // months (assuming 30 days in a month)
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
  } else if (quantity.toString().includes(".")) {
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

export default { signToken, verifyToken, parseTimeToMilliseconds };
