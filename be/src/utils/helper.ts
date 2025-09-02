import { randomBytes, createHash } from "crypto";

export const generateRandomToken = (): string => {
    return randomBytes(32).toString("hex");
};

export function sha256Base64(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('base64'); // or 'hex'
}

export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}