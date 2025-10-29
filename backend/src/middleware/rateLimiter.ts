import rateLimit from 'express-rate-limit';

const max = Number(process.env.RATE_LIMIT_MAX || 60);
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);

export const ipRateLimiter = rateLimit({
	windowMs,
	max,
	standardHeaders: true,
	legacyHeaders: false
});
