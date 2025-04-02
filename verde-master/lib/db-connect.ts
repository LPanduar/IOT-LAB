import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.DB_HOST,
        port: 3306,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
});

export default async function executeQuery({ query, values }) {
    try {
        const results = await db.query(query, values);
        await db.end();
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}