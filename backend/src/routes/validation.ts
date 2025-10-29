import { Router } from 'express';
import { ipRateLimiter } from '../middleware/rateLimiter.js';
import { validateEmail } from '../services/emailService.js';

const router = Router();

router.get('/email', ipRateLimiter, async (req, res) => {
	const email = String(req.query.email || '');
	try {
		const result = await validateEmail(email);
		res.setHeader('Cache-Control', 'public, max-age=60');
		return res.json(result);
	} catch (err) {
		return res.status(500).json({ valid: false });
	}
});

export default router;
