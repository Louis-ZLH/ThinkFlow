import pkg from 'pg';
import env from "dotenv";
env.config();
const { Pool } = pkg;

const pool = new Pool({
    user:process.env.PG_USER,
    host:process.env.PG_HOST,
    password:process.env.PG_PASSWORD,
    port:process.env.PG_PORT,
    database:process.env.PG_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;