import pool from '../database/mysql.config.js';
import type { RowDataPacket } from 'mysql2/promise';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EmailValidationReason = 'invalid_format' | 'denied_domain' | 'taken';

export async function validateEmail(email: string): Promise<{ valid: boolean; reason?: EmailValidationReason }> {
	const trimmed = email.trim().toLowerCase();
	if (!EMAIL_REGEX.test(trimmed)) {
		return { valid: false, reason: 'invalid_format' };
	}
	// TODO: denied domain list if needed
	const [rows] = await pool.query<RowDataPacket[]>(
		'SELECT COUNT(1) as count FROM users WHERE LOWER(email) = ? LIMIT 1',
		[trimmed]
	);
	const count = Number((rows[0] as any)?.count || 0);
	if (count > 0) {
		return { valid: false, reason: 'taken' };
	}
	return { valid: true };
}
