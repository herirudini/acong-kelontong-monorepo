import { randomBytes } from "crypto";

export const generateRandomToken = (): string => {
    return randomBytes(32).toString("hex");
};
