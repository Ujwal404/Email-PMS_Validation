-- Phase 1: Non-breaking checks
ALTER TABLE users 
	ADD CONSTRAINT check_email_format CHECK (email REGEXP '^[^\s@]+@[^\s@]+\.[^\s@]+$');

ALTER TABLE users 
	ADD CONSTRAINT check_pms_not_blank CHECK (pms_id IS NOT NULL AND LENGTH(TRIM(pms_id)) > 0);

-- Phase 2 (run later after backfill): enforce NOT NULL explicitly (already NOT NULL in schema)
-- Example backfill approach
-- UPDATE users SET pms_id = CONCAT('LEGACY-', id) WHERE pms_id IS NULL OR LENGTH(TRIM(pms_id)) = 0;
-- ALTER TABLE users MODIFY pms_id VARCHAR(12) NOT NULL;
