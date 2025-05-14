import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Create a neon client
const sql = neon(process.env.DATABASE_URL!);

// Create a drizzle client
const db = drizzle(sql);

export { db, sql }; 