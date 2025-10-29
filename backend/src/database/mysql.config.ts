import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

function buildSslConfig(): any | undefined {
    // Enable SSL for TiDB Cloud or any MySQL with TLS
    // Options via env:
    // - MYSQL_SSL=true          → enable TLS with default validation
    // - MYSQL_SSL_CA_PATH=path  → provide CA certificate path (e.g. ISRG Root X1 for TiDB Cloud)
    const sslEnabled = String(process.env.MYSQL_SSL || '').toLowerCase() === 'true';
    const caPath = process.env.MYSQL_SSL_CA_PATH;
    if (!sslEnabled && !caPath) return undefined;

    if (caPath) {
        const absolute = path.isAbsolute(caPath) ? caPath : path.join(process.cwd(), caPath);
        try {
            const ca = fs.readFileSync(absolute, 'utf8');
            return { ca, minVersion: 'TLSv1.2' } as any;
        } catch (_err) {
            // Fall back to generic TLS if CA file not found
            return { minVersion: 'TLSv1.2' } as any;
        }
    }
    return { minVersion: 'TLSv1.2' } as any;
}

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'example',
    database: process.env.MYSQL_DATABASE || 'validation',
    ssl: buildSslConfig(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
