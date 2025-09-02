export const JWT_SECRET = process.env.JWT_SECRET;
export const SEASON_DAYS = (process.env.SEASON_DAYS ? parseInt(process.env.SEASON_DAYS) : 7);
export const SEASON_MINUTES = (process.env.SEASON_MINUTES ? parseInt(process.env.SEASON_MINUTES) : 15);
export const SALTS = (process.env.SALTS ? parseInt(process.env.SALTS) : 10);
