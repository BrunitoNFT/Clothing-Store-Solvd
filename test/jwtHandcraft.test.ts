import {
  signToken,
  verifyToken,
  parseTimeToMilliseconds,
} from "../src/utils/jwtHandcraft"; // Adjust the path accordingly

describe("JWT Library", () => {
  const samplePayload = { userId: "1234", name: "Alice" };

  describe("signToken", () => {
    it("returns a JWT token in the correct format", () => {
      const token = signToken(samplePayload);
      expect(token.split(".").length).toBe(3);
    });

    it("returns a JWT with the correct header", () => {
      const token = signToken(samplePayload);
      const [header] = token.split(".");
      const decodedHeader = JSON.parse(
        Buffer.from(header, "base64").toString()
      );
      expect(decodedHeader.alg).toBe("HS256");
      expect(decodedHeader.typ).toBe("JWT");
    });

    it("sets the default expiry if not specified", () => {
      const token = signToken(samplePayload);
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(
        Buffer.from(payload, "base64").toString()
      );
      expect(decodedPayload.exp - decodedPayload.iat).toBeCloseTo(
        parseTimeToMilliseconds("2mo")
      );
    });

    it("sets the provided expiry if specified", () => {
      const token = signToken(samplePayload, { expiresIn: "1h" });
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(
        Buffer.from(payload, "base64").toString()
      );
      expect(decodedPayload.exp - decodedPayload.iat).toBe(
        parseTimeToMilliseconds("1h")
      );
    });
  });

  describe("verifyToken", () => {
    it("successfully verifies a valid token", () => {
      const token = signToken(samplePayload);
      console.log("verify token 1: ", token);
      const payload = verifyToken(token);
      expect(payload.userId).toBe("1234");
      expect(payload.name).toBe("Alice");
    });

    it("throws an error for an expired token", () => {
      const token = signToken(samplePayload, { expiresIn: "0" });
      jest.advanceTimersByTime(1);
      expect(() => verifyToken(token)).toThrow("Token has expired");
    });

    it("throws an error for an invalid signature", () => {
      const token = signToken(samplePayload) + "tampered";
      expect(() => verifyToken(token)).toThrow("Invalid signature");
    });

    it("throws an error for an invalid header", () => {
      const tamperedHeader = Buffer.from(
        JSON.stringify({ alg: "INVALID", typ: "JWT" })
      ).toString("base64");
      const token = signToken(samplePayload);
      const [, payload, signature] = token.split(".");
      const tamperedToken = `${tamperedHeader}.${payload}.${signature}`;
      expect(() => verifyToken(tamperedToken)).toThrow("Invalid token header");
    });
  });

  describe("parseTimeToMilliseconds", () => {
    it("converts seconds to milliseconds", () => {
      expect(parseTimeToMilliseconds("10s")).toBe(10000);
    });

    it("converts minutes to milliseconds", () => {
      expect(parseTimeToMilliseconds("2m")).toBe(120000);
    });

    it("converts hours to milliseconds", () => {
      expect(parseTimeToMilliseconds("1h")).toBe(3600000);
    });

    it("converts days to milliseconds", () => {
      expect(parseTimeToMilliseconds("1d")).toBe(86400000);
    });

    it("converts weeks to milliseconds", () => {
      expect(parseTimeToMilliseconds("1w")).toBe(604800000);
    });

    it("converts months to milliseconds", () => {
      expect(parseTimeToMilliseconds("1mo")).toBe(2592000000);
    });

    it("converts years to milliseconds", () => {
      expect(parseTimeToMilliseconds("1y")).toBe(31536000000);
    });

    it("throws an error for missing number", () => {
      expect(() => parseTimeToMilliseconds("s")).toThrow("Invalid time format");
    });

    it("throws an error for negative time values", () => {
      expect(() => parseTimeToMilliseconds("-10s")).toThrow(
        "Invalid time format"
      );
    });

    it("throws an error for non-existent time unit", () => {
      expect(() => parseTimeToMilliseconds("10x")).toThrow(
        "Invalid time format"
      );
    });

    it("returns the value directly if numeric", () => {
      expect(parseTimeToMilliseconds("10000")).toBe(10000);
    });

    it("throws an error for decimals", () => {
      expect(() => parseTimeToMilliseconds("1.5s")).toThrow(
        "Invalid time format"
      );
    });
  });
});
