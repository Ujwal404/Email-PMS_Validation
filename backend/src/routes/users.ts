import { Router } from 'express';
import { z } from 'zod';
import pool from '../database/mysql.config.js';

const router = Router();

const createUserSchema = z.object({
	email: z
		.string()
		.trim()
		.min(3)
		.max(254)
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
	pms_id: z
		.string()
		.trim()
		.toUpperCase()
		.regex(/^[A-Z0-9]{4,12}$/)
});

router.post('/', async (req, res) => {
	const parse = createUserSchema.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({
			field: 'body',
			code: 'invalid_input',
			message: 'Invalid email or pms_id',
			errors: parse.error.issues
		});
	}

	const { email, pms_id } = parse.data;
	try {
		const [result]: any = await pool.execute(
			'INSERT INTO users (email, pms_id) VALUES (?, ?)',
			[email.toLowerCase(), pms_id]
		);
		return res.status(201).json({ id: result.insertId, email: email.toLowerCase(), pms_id });
	} catch (err: any) {
		// Duplicate email or constraint violation
		if (err && err.code === 'ER_DUP_ENTRY') {
			const msg: string = String(err.sqlMessage || err.message || '');
			if (msg.includes('uq_users_pms_id') || msg.includes("for key 'uq_users_pms_id'") || msg.includes('pms_id')) {
				return res.status(409).json({ field: 'pms_id', code: 'taken', message: 'PMS ID already exists' });
			}
			return res.status(409).json({ field: 'email', code: 'taken', message: 'Email already exists' });
		}
		return res.status(500).json({ code: 'internal_error' });
	}
});

export default router;


