import { randomBytes, createHash } from "crypto";

export const generateRandomToken = (): string => {
    return randomBytes(32).toString("hex");
};

export function sha256Base64(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('base64'); // or 'hex'
}

// encode
export function encodeBase64(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64');
}

// decode (revert back)
export function decodeBase64(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf8');
}


export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function toNumber(text: any): number {
  return Number(text||0)
}